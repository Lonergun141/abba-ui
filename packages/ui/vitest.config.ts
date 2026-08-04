import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Kept separate from vite.config.ts on purpose: that config is in library mode
 * with `preserveModules`, which is the wrong shape for a test runner.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/**/index.ts"],
    },
  },
});
