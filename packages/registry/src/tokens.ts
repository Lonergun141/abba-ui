/**
 * The design token catalogue.
 *
 * These values mirror `packages/ui/src/styles/tokens.css`. The stylesheet is
 * the implementation; this is the machine-readable description of it, used by
 * the documentation site and by the MCP server so an agent can look a token up
 * instead of guessing at its name.
 *
 * `tokens.test.ts` in this package parses the stylesheet and fails if the two
 * ever disagree, so the duplication cannot rot silently.
 */

export interface TokenDef {
  /** The custom property, including the `--abba-` prefix. */
  name: string;
  /** Declared value. May be a `var()` reference to another token. */
  value: string;
  /** What the token is for, where that is not obvious from the name. */
  description?: string;
}

export interface TokenGroup {
  id: string;
  title: string;
  description: string;
  tokens: TokenDef[];
}

export const tokenGroups: TokenGroup[] = [
  {
    id: "palette-cedar",
    title: "Cedar",
    description:
      "The brand family: a deep teal-green. Cedar 600 is the default primary and reaches 6.3:1 against white text.",
    tokens: [
      { name: "--abba-cedar-50", value: "#edf6f3" },
      { name: "--abba-cedar-100", value: "#d2e9e2" },
      { name: "--abba-cedar-200", value: "#a6d3c7" },
      { name: "--abba-cedar-300", value: "#74b8a8" },
      { name: "--abba-cedar-400", value: "#45988a" },
      { name: "--abba-cedar-500", value: "#2a7c6e" },
      { name: "--abba-cedar-600", value: "#1f6b60" },
      { name: "--abba-cedar-700", value: "#175449" },
      { name: "--abba-cedar-800", value: "#123f38" },
      { name: "--abba-cedar-900", value: "#0d2c27" },
      { name: "--abba-cedar-950", value: "#071a17" },
    ],
  },
  {
    id: "palette-ember",
    title: "Ember",
    description:
      "The accent family: a warm burnt orange. Ember 500 is deliberately darker than a true mid-tone so it reaches 5.0:1 with white text.",
    tokens: [
      { name: "--abba-ember-50", value: "#fdf3ea" },
      { name: "--abba-ember-100", value: "#f9e0c9" },
      { name: "--abba-ember-200", value: "#f0c094" },
      { name: "--abba-ember-300", value: "#e39d5f" },
      { name: "--abba-ember-400", value: "#d27e33" },
      { name: "--abba-ember-500", value: "#a85714" },
      { name: "--abba-ember-600", value: "#984e13" },
      { name: "--abba-ember-700", value: "#7a3d10" },
      { name: "--abba-ember-800", value: "#5c2e0d" },
      { name: "--abba-ember-900", value: "#3f200a" },
    ],
  },
  {
    id: "palette-neutral",
    title: "Neutrals",
    description:
      "Warm-tinted rather than pure grey. The warm cast is deliberate: it is the most effective defence against a system reading as generic.",
    tokens: [
      { name: "--abba-neutral-0", value: "#ffffff" },
      { name: "--abba-neutral-25", value: "#fcfbf9" },
      { name: "--abba-neutral-50", value: "#faf9f7" },
      { name: "--abba-neutral-100", value: "#f4f2ee" },
      { name: "--abba-neutral-200", value: "#e8e4dd" },
      { name: "--abba-neutral-300", value: "#d6d0c6" },
      { name: "--abba-neutral-400", value: "#b0a89c" },
      { name: "--abba-neutral-500", value: "#857c71" },
      { name: "--abba-neutral-600", value: "#635b52" },
      { name: "--abba-neutral-700", value: "#47413a" },
      { name: "--abba-neutral-800", value: "#2e2925" },
      { name: "--abba-neutral-900", value: "#1c1815" },
      { name: "--abba-neutral-950", value: "#12100e" },
    ],
  },
  {
    id: "semantic",
    title: "Semantic roles",
    description:
      "What components actually consume, and what to override when rebranding. Palette tokens name a colour; these name a job.",
    tokens: [
      { name: "--abba-primary", value: "var(--abba-cedar-600)" },
      { name: "--abba-primary-hover", value: "var(--abba-cedar-700)" },
      { name: "--abba-primary-active", value: "var(--abba-cedar-800)" },
      { name: "--abba-primary-foreground", value: "var(--abba-neutral-0)" },
      { name: "--abba-primary-subtle", value: "var(--abba-cedar-50)" },
      { name: "--abba-primary-subtle-foreground", value: "var(--abba-cedar-800)" },
      { name: "--abba-accent", value: "var(--abba-ember-500)" },
      { name: "--abba-accent-hover", value: "var(--abba-ember-600)" },
      { name: "--abba-accent-active", value: "var(--abba-ember-700)" },
      { name: "--abba-accent-foreground", value: "var(--abba-neutral-0)" },
      { name: "--abba-accent-subtle", value: "var(--abba-ember-50)" },
      { name: "--abba-accent-subtle-foreground", value: "var(--abba-ember-800)" },
    ],
  },
  {
    id: "state",
    title: "State colours",
    description:
      "Each state has a solid and a subtle pairing. Warning uses a dark foreground: white on amber cannot reach AA without pushing the hue muddy.",
    tokens: [
      { name: "--abba-success", value: "#1f7a4d" },
      { name: "--abba-success-foreground", value: "var(--abba-neutral-0)" },
      { name: "--abba-success-subtle", value: "#e8f5ee" },
      { name: "--abba-success-subtle-foreground", value: "#10502f" },
      { name: "--abba-success-border", value: "#a8d8be" },
      { name: "--abba-warning", value: "#b7791f" },
      { name: "--abba-warning-foreground", value: "var(--abba-neutral-900)" },
      { name: "--abba-warning-subtle", value: "#fcf3e3" },
      { name: "--abba-warning-subtle-foreground", value: "#7a4e10" },
      { name: "--abba-warning-border", value: "#efd49b" },
      { name: "--abba-danger", value: "#b42318" },
      { name: "--abba-danger-hover", value: "#94170e" },
      { name: "--abba-danger-active", value: "#7a1109" },
      { name: "--abba-danger-foreground", value: "var(--abba-neutral-0)" },
      { name: "--abba-danger-subtle", value: "#fdecea" },
      { name: "--abba-danger-subtle-foreground", value: "#7a1109" },
      { name: "--abba-danger-border", value: "#f3b4ae" },
      { name: "--abba-info", value: "#2c6ba8" },
      { name: "--abba-info-foreground", value: "var(--abba-neutral-0)" },
      { name: "--abba-info-subtle", value: "#e9f1f9" },
      { name: "--abba-info-subtle-foreground", value: "#1c4a75" },
      { name: "--abba-info-border", value: "#aecbe6" },
    ],
  },
  {
    id: "surface",
    title: "Surfaces and borders",
    description: "Page, recessed and raised surfaces, plus the three border weights.",
    tokens: [
      {
        name: "--abba-background",
        value: "var(--abba-neutral-0)",
        description: "Page background",
      },
      {
        name: "--abba-background-subtle",
        value: "var(--abba-neutral-50)",
        description: "Recessed areas",
      },
      {
        name: "--abba-background-raised",
        value: "var(--abba-neutral-0)",
        description: "Cards, menus, dialogs",
      },
      {
        name: "--abba-foreground",
        value: "var(--abba-neutral-900)",
        description: "Body text",
      },
      {
        name: "--abba-muted",
        value: "var(--abba-neutral-100)",
        description: "Hover fills",
      },
      {
        name: "--abba-muted-foreground",
        value: "var(--abba-neutral-600)",
        description: "Secondary text",
      },
      {
        name: "--abba-overlay",
        value: "rgb(18 16 14 / 55%)",
        description: "Dialog scrim",
      },
      { name: "--abba-border", value: "var(--abba-neutral-300)" },
      { name: "--abba-border-subtle", value: "var(--abba-neutral-200)" },
      { name: "--abba-border-strong", value: "var(--abba-neutral-400)" },
    ],
  },
  {
    id: "space",
    title: "Spacing",
    description:
      "A 4px base scale. Layout components take the number, not the variable: gap={4} resolves to var(--abba-space-4).",
    tokens: [
      { name: "--abba-space-0", value: "0" },
      { name: "--abba-space-1", value: "0.25rem" },
      { name: "--abba-space-2", value: "0.5rem" },
      { name: "--abba-space-3", value: "0.75rem" },
      { name: "--abba-space-4", value: "1rem" },
      { name: "--abba-space-5", value: "1.25rem" },
      { name: "--abba-space-6", value: "1.5rem" },
      { name: "--abba-space-8", value: "2rem" },
      { name: "--abba-space-10", value: "2.5rem" },
      { name: "--abba-space-12", value: "3rem" },
      { name: "--abba-space-16", value: "4rem" },
      { name: "--abba-space-20", value: "5rem" },
      { name: "--abba-space-24", value: "6rem" },
    ],
  },
  {
    id: "radius",
    title: "Radii",
    description:
      "Corner rounding. Overriding these changes the system's character more than most palette swaps.",
    tokens: [
      { name: "--abba-radius-none", value: "0" },
      { name: "--abba-radius-sm", value: "6px" },
      { name: "--abba-radius-md", value: "10px" },
      { name: "--abba-radius-lg", value: "14px" },
      { name: "--abba-radius-xl", value: "20px" },
      { name: "--abba-radius-full", value: "9999px" },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    description:
      "No webfont is downloaded. Override --abba-font-sans with a family you already load and everything follows.",
    tokens: [
      {
        name: "--abba-font-sans",
        value:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      {
        name: "--abba-font-mono",
        value:
          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      },
      {
        name: "--abba-font-size-xs",
        value: "0.75rem",
        description: "Captions, shortcut hints",
      },
      {
        name: "--abba-font-size-sm",
        value: "0.875rem",
        description: "Secondary text, dense UI",
      },
      {
        name: "--abba-font-size-md",
        value: "1rem",
        description: "Body copy — the default",
      },
      {
        name: "--abba-font-size-lg",
        value: "1.125rem",
        description: "Lead paragraphs",
      },
      {
        name: "--abba-font-size-xl",
        value: "1.375rem",
        description: "Section headings",
      },
      { name: "--abba-font-size-2xl", value: "1.75rem", description: "Page headings" },
      { name: "--abba-font-size-3xl", value: "2.25rem", description: "Page titles" },
      { name: "--abba-font-size-4xl", value: "3rem", description: "Display" },
      { name: "--abba-font-weight-regular", value: "400" },
      { name: "--abba-font-weight-medium", value: "500" },
      { name: "--abba-font-weight-semibold", value: "600" },
      { name: "--abba-font-weight-bold", value: "700" },
      { name: "--abba-line-height-tight", value: "1.2" },
      { name: "--abba-line-height-snug", value: "1.35" },
      { name: "--abba-line-height-normal", value: "1.55" },
      { name: "--abba-line-height-relaxed", value: "1.75" },
      { name: "--abba-letter-spacing-tight", value: "-0.018em" },
      { name: "--abba-letter-spacing-normal", value: "0" },
      { name: "--abba-letter-spacing-wide", value: "0.04em" },
    ],
  },
  {
    id: "elevation",
    title: "Elevation",
    description:
      "Warm-tinted rather than neutral black — a pure black shadow over a warm surface reads as grey dirt. The dark theme swaps in higher-opacity black.",
    tokens: [
      {
        name: "--abba-shadow-xs",
        value: "0 1px 2px rgb(28 24 21 / 6%)",
        description: "Inputs",
      },
      {
        name: "--abba-shadow-sm",
        value: "0 1px 3px rgb(28 24 21 / 8%), 0 1px 2px rgb(28 24 21 / 5%)",
        description: "Resting cards",
      },
      {
        name: "--abba-shadow-md",
        value: "0 4px 10px rgb(28 24 21 / 8%), 0 2px 4px rgb(28 24 21 / 5%)",
        description: "Hovered cards, dropdown menus",
      },
      {
        name: "--abba-shadow-lg",
        value: "0 12px 24px rgb(28 24 21 / 10%), 0 4px 8px rgb(28 24 21 / 5%)",
        description: "Popovers",
      },
      {
        name: "--abba-shadow-xl",
        value: "0 24px 48px rgb(28 24 21 / 14%), 0 8px 16px rgb(28 24 21 / 6%)",
        description: "Dialogs",
      },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    description:
      "Every animated component honours prefers-reduced-motion. Where motion carries meaning it degrades to a static state rather than disappearing.",
    tokens: [
      {
        name: "--abba-duration-instant",
        value: "80ms",
        description: "State flips with no perceived travel",
      },
      {
        name: "--abba-duration-fast",
        value: "140ms",
        description: "Hover, focus, small colour changes",
      },
      {
        name: "--abba-duration-normal",
        value: "220ms",
        description: "Menus, popovers",
      },
      {
        name: "--abba-duration-slow",
        value: "320ms",
        description: "Dialogs and larger surfaces",
      },
      {
        name: "--abba-ease-standard",
        value: "cubic-bezier(0.2, 0, 0, 1)",
        description: "Default curve",
      },
      {
        name: "--abba-ease-out",
        value: "cubic-bezier(0, 0, 0.2, 1)",
        description: "Entering the screen",
      },
      {
        name: "--abba-ease-in",
        value: "cubic-bezier(0.4, 0, 1, 1)",
        description: "Leaving the screen",
      },
    ],
  },
  {
    id: "z-index",
    title: "Z-index",
    description:
      "A named scale, so overlay ordering is decided once here rather than re-litigated with z-index: 9999 in every application.",
    tokens: [
      { name: "--abba-z-base", value: "0" },
      { name: "--abba-z-raised", value: "10" },
      { name: "--abba-z-sticky", value: "100" },
      { name: "--abba-z-overlay", value: "1000" },
      { name: "--abba-z-modal", value: "1100" },
      { name: "--abba-z-popover", value: "1200" },
      { name: "--abba-z-toast", value: "1300" },
      { name: "--abba-z-tooltip", value: "1400" },
    ],
  },
  {
    id: "focus",
    title: "Focus and disabled",
    description: "One ring treatment across every focusable component.",
    tokens: [
      { name: "--abba-focus-ring", value: "var(--abba-cedar-300)" },
      { name: "--abba-focus-ring-width", value: "3px" },
      { name: "--abba-focus-ring-offset", value: "2px" },
      { name: "--abba-disabled-opacity", value: "0.55" },
    ],
  },
];

/** Every token, flattened. */
export const tokens: TokenDef[] = tokenGroups.flatMap((group) => group.tokens);

export function getTokenGroup(id: string): TokenGroup | undefined {
  return tokenGroups.find((group) => group.id === id);
}

export function findToken(name: string): TokenDef | undefined {
  const needle = name.startsWith("--") ? name : `--abba-${name}`;
  return tokens.find((token) => token.name === needle);
}
