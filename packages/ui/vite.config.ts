import { readdirSync } from "node:fs";
import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import MagicString from "magic-string";
import { defineConfig, type Plugin } from "vite";

const USE_CLIENT = /^\s*(["'])use client\1\s*;?/;

/**
 * Rollup strips module-level directives during bundling, which would silently
 * turn every interactive component into a Server Component in consuming apps.
 *
 * This records which modules declared `"use client"` before any other plugin
 * rewrites the source (`enforce: "pre"`), then re-prepends the directive to the
 * chunks those modules ended up in. MagicString is used rather than raw string
 * concatenation so the emitted source maps stay aligned.
 */
function preserveUseClient(): Plugin {
  const clientModules = new Set<string>();

  return {
    name: "abba:preserve-use-client",
    enforce: "pre",
    transform(code, id) {
      if (USE_CLIENT.test(code)) {
        clientModules.add(id);
      }
      return null;
    },
    renderChunk(code, chunk) {
      const isClientChunk = Object.keys(chunk.modules).some((id) =>
        clientModules.has(id),
      );
      if (!isClientChunk) return null;

      const magic = new MagicString(code);
      magic.prepend('"use client";\n');
      return {
        code: magic.toString(),
        map: magic.generateMap({ hires: true }),
      };
    },
  };
}

/**
 * Every component directory is its own entry point.
 *
 * The package advertises `@abbainitiative/ui/button` and 26 sibling subpaths in
 * its `exports` map. With only `src/index.ts` as an entry, Rollup treats each
 * component's barrel as an internal re-export and elides it — so those
 * advertised subpaths resolve to files that were never emitted. That break is
 * invisible to the test suite and to the docs site, which both import from the
 * root barrel; it only surfaces once the package is packed and installed, which
 * is what `pnpm test:package` does.
 *
 * Read from the filesystem rather than listed by hand so a new component cannot
 * be added with a subpath that silently fails to build.
 */
const componentsDir = resolve(import.meta.dirname, "src/components");

const entries: Record<string, string> = {
  index: resolve(import.meta.dirname, "src/index.ts"),
};

for (const dirent of readdirSync(componentsDir, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  entries[`components/${dirent.name}/index`] = resolve(
    componentsDir,
    dirent.name,
    "index.ts",
  );
}

export default defineConfig({
  plugins: [react(), preserveUseClient()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Libraries ship unminified: the consuming application's bundler minifies,
    // and readable output makes `"use client"` boundaries auditable.
    minify: false,
    cssCodeSplit: false,
    lib: {
      entry: entries,
      formats: ["es"],
      cssFileName: "styles",
    },
    rollupOptions: {
      // React must never be bundled — a second copy breaks hooks. Radix ships
      // its own client boundaries, so bundling it would strip them.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@radix-ui\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
      onwarn(warning, warn) {
        // Expected: the directives are re-attached by preserveUseClient above.
        // Suppressed by code rather than silencing warnings wholesale.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
  css: {
    modules: {
      generateScopedName: "abba-[local]-[hash:base64:5]",
    },
  },
});
