import tseslint from "typescript-eslint";

import { reactLibraryConfig } from "./react-library.js";

/**
 * Next.js applications. Extends the React library config; the Next compiler
 * handles framework-specific checks during `next build`.
 */
export const nextConfig = tseslint.config(...reactLibraryConfig, {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Server Components legitimately export async functions as default.
    "@typescript-eslint/require-await": "off",
  },
});

export default nextConfig;
