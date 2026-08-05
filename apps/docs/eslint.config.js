import { nextConfig } from "@abbainitiative/eslint-config/next";

export default [
  ...nextConfig,
  {
    files: ["**/*.tsx"],
    rules: {
      /**
       * Allow `tabIndex={0}` on an element with `role="region"`.
       *
       * The code samples on this site scroll horizontally, and WCAG 2.1.1
       * requires a scrollable region to be reachable by keyboard — a mouse user
       * can scroll it, so a keyboard user must be able to as well. The rule's
       * `roles` option exists for exactly this case; its default list already
       * contains `tabpanel` for the same reason.
       */
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel", "region"], allowExpressionValues: true },
      ],
    },
  },
  { ignores: [".next/**", "next-env.d.ts"] },
];
