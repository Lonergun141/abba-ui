// @vitest-environment node

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guards the published API surface.
 *
 * Adding a component without adding its `exports` entry produces a package that
 * builds and tests cleanly but 404s on `@abbainitiative/ui/<name>` for every
 * consumer. That is exactly the class of failure the brief asks the production
 * build to catch, so it is asserted here rather than left to review.
 */

interface PackageManifest {
  exports: Record<string, unknown>;
}

// Resolved from the working directory rather than `import.meta.url`: Vitest
// serves modules over http:// to the test environment, so fileURLToPath rejects
// the module URL. Vitest runs each project from its own package root.
const packageJsonPath = resolve(process.cwd(), "package.json");
const componentsDir = resolve(process.cwd(), "src/components");

const manifest = JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageManifest;

const NON_COMPONENT_KEYS = new Set([".", "./styles.css", "./package.json"]);

const componentDirectories = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const componentExportKeys = Object.keys(manifest.exports)
  .filter((key) => !NON_COMPONENT_KEYS.has(key))
  .map((key) => key.replace(/^\.\//, ""))
  .sort();

describe("package exports contract", () => {
  it("finds at least one component to check", () => {
    expect(componentDirectories.length).toBeGreaterThan(0);
  });

  it("exports every component directory", () => {
    const missing = componentDirectories.filter(
      (dir) => !componentExportKeys.includes(dir),
    );
    expect(missing, `components with no exports entry: ${missing.join(", ")}`).toEqual(
      [],
    );
  });

  it("has no exports entry pointing at a component that does not exist", () => {
    const dangling = componentExportKeys.filter(
      (key) => !componentDirectories.includes(key),
    );
    expect(
      dangling,
      `exports entries with no component: ${dangling.join(", ")}`,
    ).toEqual([]);
  });

  it("always exports the root entry and the stylesheet", () => {
    expect(manifest.exports["."]).toBeDefined();
    expect(manifest.exports["./styles.css"]).toBe("./dist/styles.css");
  });

  it("gives every component subpath both types and an import target", () => {
    for (const key of Object.keys(manifest.exports)) {
      if (NON_COMPONENT_KEYS.has(key)) continue;
      const entry = manifest.exports[key] as Record<string, string>;
      expect(entry.types, `${key} is missing "types"`).toMatch(/^\.\/dist\/.*\.d\.ts$/);
      expect(entry.import, `${key} is missing "import"`).toMatch(/^\.\/dist\/.*\.js$/);
    }
  });
});
