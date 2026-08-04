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
      entry: resolve(import.meta.dirname, "src/index.ts"),
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
