import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

/**
 * Base flat config shared by every workspace package.
 *
 * `prettier` is last so formatting rules are switched off rather than fought.
 */
export const baseConfig = tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/*.tgz",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    // Config and script files run in Node and are not part of a typed project.
    files: ["**/*.config.{js,mjs,ts}", "**/scripts/**/*.{js,mjs}", "eslint.config.js"],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      // disableTypeChecked carries its own rule set. Spreading the config and
      // then assigning `rules` outright would replace it, leaving type-aware
      // rules switched on for files that have no typed program behind them.
      ...tseslint.configs.disableTypeChecked.rules,
      "no-console": "off",
    },
  },
  prettier,
);

export default baseConfig;
