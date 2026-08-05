/**
 * Verifies the package as npm would actually publish it.
 *
 * Every other check in this repository runs against the working tree. This one
 * runs `npm pack`, extracts the tarball into a throwaway `node_modules`, and
 * inspects what a consumer would receive — which is the only artefact that
 * matters and the one most likely to differ from what the source suggests.
 *
 * Deliberately network-free. Resolution is performed with `import.meta.resolve`
 * rather than by installing dependencies and importing, so the check is fast,
 * works offline, and cannot be confused by a registry outage. The trade-off is
 * that it proves the export map resolves, not that the modules execute; the
 * unit suite already covers execution.
 *
 * Run with: pnpm test:package
 */

import { execFileSync, execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_DIR = join(ROOT, "packages", "ui");
const PACKAGE_NAME = "@abbainitiative/ui";

const failures = [];
const checks = [];

function check(description, condition, detail) {
  checks.push(description);
  if (!condition) failures.push(detail ? `${description}\n    ${detail}` : description);
}

function heading(text) {
  process.stdout.write(`\n${text}\n${"-".repeat(text.length)}\n`);
}

/* ------------------------------------------------------------------ pack */

heading("Packing");

if (!existsSync(join(PACKAGE_DIR, "dist"))) {
  console.error(
    "packages/ui/dist is missing. Run `pnpm --filter @abbainitiative/ui build` first.",
  );
  process.exit(1);
}

const workDir = mkdtempSync(join(tmpdir(), "abba-pack-"));

let tarball;
try {
  /*
   * `execSync` with a single command string, not `execFileSync` with an args
   * array. npm is a `.cmd` shim on Windows, which Node 20+ refuses to spawn
   * without a shell (EINVAL), and passing an args array *with* a shell is
   * deprecated because the arguments are concatenated rather than escaped.
   * A pre-quoted command string is the one form that is neither.
   *
   * --json gives the filename without parsing npm's human-readable output,
   * which changes between versions.
   */
  const output = execSync(`npm pack --json --pack-destination "${workDir}"`, {
    cwd: PACKAGE_DIR,
    encoding: "utf8",
  });
  const parsed = JSON.parse(output);
  tarball = join(workDir, parsed[0].filename);
  console.log(
    `  ${parsed[0].filename} — ${String(parsed[0].files.length)} files, ${formatSize(parsed[0].unpackedSize)} unpacked`,
  );
} catch (error) {
  console.error("npm pack failed:", error.message);
  rmSync(workDir, { recursive: true, force: true });
  process.exit(1);
}

/* --------------------------------------------------------------- extract */

// Extract into a real node_modules layout so Node's resolver treats the
// extracted directory as an installed package, exports map and all.
const consumerDir = join(workDir, "consumer");
const installedDir = join(consumerDir, "node_modules", "@abbainitiative", "ui");
mkdirSync(installedDir, { recursive: true });

// bsdtar ships with Windows 10+ and every supported CI image, so one call works
// everywhere. Extracted with --strip-components to drop npm's `package/` root.
execFileSync("tar", ["-xzf", tarball, "-C", installedDir, "--strip-components=1"]);

// A package.json in the consumer root makes it a module scope of its own, so
// resolution behaves the way it would in a real project.
writeFileSync(
  join(consumerDir, "package.json"),
  JSON.stringify(
    { name: "abba-pack-consumer", private: true, type: "module" },
    null,
    2,
  ),
);
const probeEntry = join(consumerDir, "resolve-probe.mjs");

const manifest = JSON.parse(readFileSync(join(installedDir, "package.json"), "utf8"));

/* ------------------------------------------------------- tarball contents */

heading("Tarball contents");

const packedFiles = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
  .split("\n")
  .map((line) => line.trim().replace(/^package\//, ""))
  .filter(Boolean);

check("ships dist/index.js", packedFiles.includes("dist/index.js"));
check("ships dist/index.d.ts", packedFiles.includes("dist/index.d.ts"));
check("ships dist/styles.css", packedFiles.includes("dist/styles.css"));
check("ships README.md", packedFiles.includes("README.md"));
check("ships LICENSE", packedFiles.includes("LICENSE"));

const leaked = packedFiles.filter(
  (file) =>
    file.endsWith(".test.ts") ||
    file.endsWith(".test.tsx") ||
    file.startsWith("src/") ||
    file.startsWith("node_modules/") ||
    file === "vite.config.ts" ||
    file === "tsconfig.json",
);
check(
  "ships no source, tests or config",
  leaked.length === 0,
  leaked.length > 0 ? `leaked: ${leaked.join(", ")}` : undefined,
);

/* ------------------------------------------------------------ export map */

heading("Export map");

const subpaths = Object.keys(manifest.exports);
check(
  "declares at least 25 entry points",
  subpaths.length >= 25,
  `found ${String(subpaths.length)}`,
);

const specifiers = subpaths.map((subpath) =>
  subpath === "." ? PACKAGE_NAME : `${PACKAGE_NAME}/${subpath.slice(2)}`,
);

/*
 * Resolution runs in a child process rooted inside the fake consumer.
 * `import.meta.resolve` resolves relative to the module that calls it, and only
 * accepts a parent URL under an experimental flag — so the probe has to live in
 * the consumer directory rather than being called from here.
 */
writeFileSync(
  probeEntry,
  `const specifiers = ${JSON.stringify(specifiers, null, 2)};
const results = {};
for (const specifier of specifiers) {
  try {
    results[specifier] = { url: import.meta.resolve(specifier) };
  } catch (error) {
    results[specifier] = { error: error.message };
  }
}
process.stdout.write(JSON.stringify(results));
`,
);

const resolutions = JSON.parse(
  execFileSync(process.execPath, [probeEntry], { cwd: consumerDir, encoding: "utf8" }),
);

for (const subpath of subpaths) {
  const specifier =
    subpath === "." ? PACKAGE_NAME : `${PACKAGE_NAME}/${subpath.slice(2)}`;
  const result = resolutions[specifier];

  if (result.error) {
    check(`resolves ${specifier}`, false, result.error);
    continue;
  }

  check(
    `resolves ${specifier}`,
    existsSync(fileURLToPath(result.url)),
    `resolved to a file that does not exist: ${result.url}`,
  );

  // Node does not resolve the `types` condition, so check it by hand.
  const entry = manifest.exports[subpath];
  if (typeof entry === "object" && entry.types) {
    const typesPath = join(installedDir, entry.types);
    check(
      `types exist for ${specifier}`,
      existsSync(typesPath),
      `missing: ${entry.types}`,
    );
  }
}

/* ------------------------------------------- client boundary placement */

heading('"use client" placement');

const USE_CLIENT = /^\s*(["'])use client\1\s*;?/;

function hasDirective(relativePath) {
  const filePath = join(installedDir, relativePath);
  if (!existsSync(filePath)) return null;
  return USE_CLIENT.test(readFileSync(filePath, "utf8"));
}

// The barrel must stay directive-free, otherwise importing a Stack from a
// Server Component drags the whole library across the client boundary. This is
// the single most important property of the build.
check(
  "dist/index.js has no directive",
  hasDirective("dist/index.js") === false,
  'the barrel carries "use client" — every consumer import becomes a Client Component',
);

const CLIENT_COMPONENTS = [
  "alert",
  "button",
  "dialog",
  "dropdown-menu",
  "form-field",
  "icon-button",
  "input",
  "tabs",
  "textarea",
  "toast",
];

for (const name of CLIENT_COMPONENTS) {
  const result = hasDirective(`dist/components/${name}/${name}.js`);
  check(
    `${name} carries the directive`,
    result === true,
    result === null ? "chunk not found" : undefined,
  );
}

const SERVER_COMPONENTS = [
  "badge",
  "box",
  "button-group",
  "card",
  "code",
  "container",
  "form-message",
  "grid",
  "heading",
  "inline",
  "label",
  "link",
  "separator",
  "spinner",
  "stack",
  "text",
  "visually-hidden",
];

for (const name of SERVER_COMPONENTS) {
  const result = hasDirective(`dist/components/${name}/${name}.js`);
  check(
    `${name} stays server-renderable`,
    result === false,
    result === null ? "chunk not found" : "carries an unnecessary client directive",
  );
}

/* -------------------------------------------------------------- manifest */

heading("Manifest");

check("declares react as a peer dependency", Boolean(manifest.peerDependencies?.react));
check(
  "declares react-dom as a peer dependency",
  Boolean(manifest.peerDependencies?.["react-dom"]),
);
check("does not depend on react directly", !manifest.dependencies?.react);
check('is "type": "module"', manifest.type === "module");
check(
  "marks CSS as the only side effect",
  JSON.stringify(manifest.sideEffects) === '["**/*.css"]',
);
check("publishes publicly", manifest.publishConfig?.access === "public");
check(
  "has no publish credentials in the manifest",
  !JSON.stringify(manifest).includes("_auth"),
);

/* ---------------------------------------------------------------- report */

rmSync(workDir, { recursive: true, force: true });

heading("Result");

if (failures.length > 0) {
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error(
    `\n${String(failures.length)} of ${String(checks.length)} checks failed.`,
  );
  process.exit(1);
}

console.log(`  ✓ ${String(checks.length)} checks passed against the packed tarball.`);

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}
