import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  /**
   * `transpilePackages` is deliberately absent.
   *
   * Turborepo builds @abbainitiative/ui to dist before this app compiles, so
   * the docs site consumes exactly the compiled output that npm consumers get.
   * Adding transpilePackages would make Next compile the package's TypeScript
   * source instead, and the site would stop being a check on the real artefact.
   */

  typescript: {
    // Never let a type error reach production. This is the default; stated
    // explicitly so a future edit has to make the decision deliberately.
    ignoreBuildErrors: false,
  },

  // There is no `eslint` block: Next 16 dropped the built-in lint step, so
  // linting is a separate CI job (`pnpm lint`) rather than part of the build.
};

export default config;
