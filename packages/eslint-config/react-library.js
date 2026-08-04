import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

import { baseConfig } from "./base.js";

/**
 * Config for React libraries and applications.
 *
 * jsx-a11y is treated as errors rather than warnings: this is a design system,
 * so an inaccessible primitive is a defect, not a suggestion.
 */
export const reactLibraryConfig = tseslint.config(
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      // Pinned rather than "detect". eslint-plugin-react's version detection
      // calls context.getFilename(), which ESLint 10 removed, so "detect"
      // crashes the whole run with `contextOrFilename.getFilename is not a
      // function`. Bump this alongside the React peer range.
      react: { version: "19.2" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "react/prop-types": "off",
      "react/display-name": "error",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/test/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
);

export default reactLibraryConfig;
