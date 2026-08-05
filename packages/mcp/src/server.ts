import {
  CATEGORY_ORDER,
  type ComponentDoc,
  components,
  componentsByCategory,
  findToken,
  getComponent,
  tokenGroups,
  tokens,
} from "@abbainitiative/registry";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  formatComponent,
  formatComponentList,
  formatToken,
  formatTokenGroup,
  PACKAGE_NAME,
} from "./format.js";

/**
 * The ABBA UI MCP server.
 *
 * Coding agents are good at writing React and bad at remembering which props a
 * particular library accepts. Left to guess, they invent plausible ones —
 * `<Button color="primary">` instead of `variant`, or a `size="medium"` that
 * does not exist. These tools let the agent read the real answer.
 *
 * Every tool is read-only and takes no side effects, which is what the
 * `readOnlyHint` annotations tell the client.
 */

const VERSION = "0.1.0";

/** Accepts "Button", "button", "DropdownMenu" or "dropdown-menu" alike. */
function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveComponent(name: string): ComponentDoc | undefined {
  const direct = getComponent(name);
  if (direct) return direct;

  const needle = normalise(name);
  return components.find(
    (component) =>
      normalise(component.name) === needle || normalise(component.slug) === needle,
  );
}

/**
 * Levenshtein distance, used so a typo still routes somewhere.
 *
 * Substring matching alone is not enough: "Buton" neither contains nor is
 * contained by "Button", and a model that mistypes a name should get a
 * correction rather than a dead end.
 */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1);
      const deletion = (previous[j] ?? 0) + 1;
      const insertion = (current[j - 1] ?? 0) + 1;
      current[j] = Math.min(substitution, deletion, insertion);
    }
    previous = current;
  }

  return previous[b.length] ?? Math.max(a.length, b.length);
}

/** A miss should point somewhere, not just fail. */
function suggestionsFor(name: string): string {
  const needle = normalise(name);

  const scored = components
    .map((component) => {
      const candidates = [component.name, component.slug, ...component.exports].map(
        normalise,
      );
      const contains = candidates.some(
        (candidate) => candidate.includes(needle) || needle.includes(candidate),
      );
      const distance = Math.min(
        ...candidates.map((candidate) => editDistance(needle, candidate)),
      );
      return { component, contains, distance };
    })
    // A distance of a third of the word tolerates a typo or two without
    // matching everything once the query is long.
    .filter(
      (entry) => entry.contains || entry.distance <= Math.max(2, needle.length / 3),
    )
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  if (scored.length === 0) {
    return `Call list_components to see all ${String(components.length)} names.`;
  }
  return `Did you mean: ${scored.map((entry) => entry.component.name).join(", ")}?`;
}

function text(body: string): {
  content: { type: "text"; text: string }[];
} {
  return { content: [{ type: "text", text: body }] };
}

export function createServer(): McpServer {
  const server = new McpServer(
    { name: "abba-ui", version: VERSION },
    {
      instructions: [
        `This server describes ${PACKAGE_NAME} (ABBA UI), a React component library.`,
        "",
        "Before writing code that uses an ABBA UI component, call get_component to read",
        "its real props and examples. Variants, tones and sizes are string unions — a",
        "value that is not listed will not compile.",
        "",
        "Setup is two imports: the stylesheet once at the app root, then components",
        "anywhere. Call get_setup for the exact snippet for a framework.",
      ].join("\n"),
    },
  );

  server.registerTool(
    "list_components",
    {
      title: "List components",
      description:
        "Lists every ABBA UI component with its category, summary and named exports. Use this to find the right component before looking up its props.",
      inputSchema: {
        category: z
          .enum(CATEGORY_ORDER as [string, ...string[]])
          .optional()
          .describe("Restrict to one category. Omit for all components."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ category }) => {
      if (category !== undefined) {
        const group = componentsByCategory().find(
          (entry) => entry.category === category,
        );
        return text(
          `# ${category}\n\n${formatComponentList(group ? group.items : [])}`,
        );
      }

      const body = componentsByCategory()
        .map((group) => `## ${group.category}\n\n${formatComponentList(group.items)}`)
        .join("\n\n");

      return text(
        `# ABBA UI components (${String(components.length)})\n\nInstall with \`pnpm add ${PACKAGE_NAME}\`.\n\n${body}`,
      );
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a component",
      description:
        "Returns the full record for one component: description, import statement, every prop with its type and default, runnable examples, and its accessibility behaviour. Call this before writing code that uses the component.",
      inputSchema: {
        name: z
          .string()
          .describe(
            'Component name or slug, e.g. "Button", "DropdownMenu" or "form-field".',
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ name }) => {
      const component = resolveComponent(name);
      if (!component) {
        return text(`No component named "${name}". ${suggestionsFor(name)}`);
      }
      return text(formatComponent(component));
    },
  );

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description:
        "Finds components by keyword, matching names, summaries, descriptions and prop names. Use it when you know what you need to build but not what it is called here.",
      inputSchema: {
        query: z
          .string()
          .describe('What you are looking for, e.g. "modal", "loading", "tabs".'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ query }) => {
      const needle = query.toLowerCase().trim();
      if (needle.length === 0) {
        return text("Give a search term, or call list_components for the full set.");
      }

      const matches = components.filter((component) => {
        const haystack = [
          component.name,
          component.slug,
          component.category,
          component.summary,
          component.description,
          component.exports.join(" "),
          component.props.map((prop) => `${prop.name} ${prop.description}`).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      });

      return text(
        `${String(matches.length)} of ${String(components.length)} components match "${query}".\n\n${formatComponentList(matches)}`,
      );
    },
  );

  server.registerTool(
    "list_tokens",
    {
      title: "List design tokens",
      description:
        "Lists the CSS custom properties the components are built from. Use this when theming, or when writing styles that should sit alongside ABBA UI rather than fight it.",
      inputSchema: {
        group: z
          .string()
          .optional()
          .describe(
            `Restrict to one group: ${tokenGroups.map((entry) => entry.id).join(", ")}. Omit for all.`,
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ group }) => {
      if (group !== undefined) {
        const found = tokenGroups.find((entry) => entry.id === group);
        if (!found) {
          return text(
            `No token group "${group}". Available groups: ${tokenGroups.map((entry) => entry.id).join(", ")}.`,
          );
        }
        return text(formatTokenGroup(found));
      }

      return text(
        [
          `# ABBA UI design tokens (${String(tokens.length)})`,
          "",
          "Override any of these in your own stylesheet, after the ABBA stylesheet, to retheme the system. Custom properties inherit, so declaring them on an element themes only that subtree.",
          "",
          tokenGroups.map(formatTokenGroup).join("\n\n"),
        ].join("\n"),
      );
    },
  );

  server.registerTool(
    "find_token",
    {
      title: "Find one design token",
      description:
        "Looks up a single CSS custom property by name and returns its value. Use it to check a token exists and what it resolves to before referencing it in CSS.",
      inputSchema: {
        name: z
          .string()
          .describe(
            'Token name, with or without the prefix: "--abba-primary" or "primary".',
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ name }) => {
      const token = findToken(name);
      if (!token) {
        const needle = name.replace(/^--abba-/, "").toLowerCase();
        const near = tokens
          .filter((candidate) => candidate.name.includes(needle))
          .slice(0, 8)
          .map((candidate) => candidate.name);

        return text(
          near.length > 0
            ? `No token named "${name}". Close matches: ${near.join(", ")}.`
            : `No token named "${name}". Call list_tokens to see all ${String(tokens.length)}.`,
        );
      }
      return text(formatToken(token));
    },
  );

  server.registerTool(
    "get_theming",
    {
      title: "Get theming instructions",
      description:
        "Explains how to restyle ABBA UI for another product: which tokens to override, how to do it for light and dark, how to scope a theme to part of a page, and what to check afterwards. Call this before hand-writing CSS to change how components look.",
      inputSchema: {
        topic: z
          .enum(["overview", "colour", "shape", "typography", "dark-mode", "scoped"])
          .default("overview")
          .describe("Which part of theming to explain."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ topic }) => text(themingFor(topic)),
  );

  server.registerTool(
    "get_setup",
    {
      title: "Get setup instructions",
      description:
        "Returns the exact install and import steps for a framework, including where the stylesheet goes.",
      inputSchema: {
        framework: z
          .enum(["nextjs", "vite", "react"])
          .default("nextjs")
          .describe("Which setup to describe."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ framework }) => text(setupFor(framework)),
  );

  return server;
}

type ThemingTopic =
  "overview" | "colour" | "shape" | "typography" | "dark-mode" | "scoped";

const THEMING: Record<ThemingTopic, string> = {
  overview: `# Theming ABBA UI

Theming is a stylesheet, not an API. There is no provider to mount and no runtime: you redeclare the custom properties you want to change, and every component follows.

Two rules cover almost everything:

1. **Load your overrides after the ABBA stylesheet.** Both declare at \`:root\`, so equal specificity means source order decides.
2. **Override the semantic layer, not the palette.** \`--abba-primary\` is "the colour of primary actions". \`--abba-cedar-600\` is a specific teal. Components only read the semantic layer.

\`\`\`css
/* app/theme.css, imported after ${PACKAGE_NAME}/styles.css */
:root {
  --abba-primary: #4338ca;
  --abba-primary-hover: #3730a3;
  --abba-primary-active: #312e81;
  --abba-primary-foreground: #ffffff;
  --abba-primary-subtle: #eef2ff;
  --abba-primary-subtle-foreground: #312e81;
  --abba-focus-ring: #a5b4fc;
}
\`\`\`

Call \`list_tokens\` for the full set, or \`get_theming\` with a topic: colour, shape, typography, dark-mode, scoped.

**Class names are not public API.** They are content-hashed and change between builds, so never style against them. Use tokens, or the \`className\` prop — every component merges it after its own classes, so your class wins without \`!important\`.`,

  colour: `# Theming colour

Override the semantic role, and give every state the accent needs:

\`\`\`css
:root {
  --abba-primary: #4338ca;         /* solid fills, primary buttons */
  --abba-primary-hover: #3730a3;
  --abba-primary-active: #312e81;
  --abba-primary-foreground: #fff; /* text ON the solid fill */
  --abba-primary-subtle: #eef2ff;  /* tinted backgrounds, subtle badges */
  --abba-primary-subtle-foreground: #312e81;
  --abba-focus-ring: #a5b4fc;
}
\`\`\`

The accent family (\`--abba-accent-*\`) has the same shape. State colours (\`--abba-success\`, \`--abba-warning\`, \`--abba-danger\`, \`--abba-info\`) each have solid, \`-foreground\`, \`-subtle\`, \`-subtle-foreground\` and \`-border\` variants.

**Check contrast after overriding.** The defaults were tuned to clear WCAG AA at every pairing the components use; an override discards that work. Text on a solid fill needs 4.5:1, large text 3:1, and a focus ring 3:1 against its surroundings.

Do not forget \`--abba-primary-foreground\`. A light accent with white text is the most common way a retheme becomes unreadable.`,

  shape: `# Theming shape

Radii carry as much brand identity as colour. Flattening them changes the system's character more than most palette swaps.

\`\`\`css
/* Squarer */
:root {
  --abba-radius-sm: 2px;
  --abba-radius-md: 3px;
  --abba-radius-lg: 4px;
  --abba-radius-xl: 6px;
}

/* Pill-shaped controls; cards stay rounded */
:root {
  --abba-radius-sm: 9999px;
  --abba-radius-md: 9999px;
  --abba-radius-lg: 22px;
  --abba-radius-xl: 28px;
}
\`\`\`

Buttons and inputs use \`--abba-radius-md\`; cards and panels use \`--abba-radius-lg\`; dialogs use \`--abba-radius-xl\`.

Spacing is on a 4px scale (\`--abba-space-1\` … \`--abba-space-24\`). Layout components take the number rather than the variable: \`<Stack gap={4}>\` resolves to \`var(--abba-space-4)\`.`,

  typography: `# Theming typography

The library downloads no webfont. \`--abba-font-sans\` resolves to the platform UI stack, so point it at a family you already load.

\`\`\`tsx
// Next.js
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--app-font" });

// on <html>: className={inter.variable}
\`\`\`

\`\`\`css
:root {
  --abba-font-sans: var(--app-font), system-ui, sans-serif;
  --abba-font-mono: "JetBrains Mono", ui-monospace, monospace;
}
\`\`\`

The type scale runs \`--abba-font-size-xs\` (0.75rem) to \`--abba-font-size-4xl\` (3rem). Weights, line heights and letter spacing are tokens too — call \`list_tokens\` with group \`typography\`.

\`Heading\` separates rank from size: \`<Heading level={3} size="xl">\` renders an \`h3\` that looks large, so you can keep the document outline honest.`,

  "dark-mode": `# Dark mode

The dark token set ships under **both** \`[data-theme="dark"]\` and \`.dark\`, so it drops into either convention — including \`next-themes\` with its default \`attribute="class"\`.

Set one of them on \`<html>\`:

\`\`\`js
document.documentElement.setAttribute("data-theme", "dark");
\`\`\`

**A custom accent needs a dark set of its own.** A colour legible on white is rarely legible on near-black, and the light values will not degrade gracefully:

\`\`\`css
:root {
  --abba-primary: #4338ca;
  --abba-primary-foreground: #ffffff;
  --abba-primary-subtle: #eef2ff;
}

[data-theme="dark"] {
  --abba-primary: #a5b4fc;          /* lighter, so it reads on dark */
  --abba-primary-foreground: #1e1b4b; /* dark text on a light fill */
  --abba-primary-subtle: #1e1b4b;
  --abba-primary-subtle-foreground: #c7d2fe;
}
\`\`\`

Radii and spacing do not change between themes — declare those in \`:root\` only.

To avoid a flash of the wrong theme, set the attribute in a blocking script in \`<head>\` before React hydrates, and put \`suppressHydrationWarning\` on \`<html>\`.`,

  scoped: `# Scoped themes

Custom properties inherit, so a theme does not have to be global. Declare tokens on any element and only its subtree changes.

\`\`\`css
.marketingSection {
  --abba-primary: var(--abba-ember-500);
  --abba-primary-hover: var(--abba-ember-600);
  --abba-radius-md: var(--abba-radius-full);
}
\`\`\`

\`\`\`tsx
// Or inline, for a theme chosen at runtime:
<div style={{ "--abba-primary": brand.primary } as React.CSSProperties}>
  <Button>Uses the tenant's colour</Button>
</div>
\`\`\`

This is how multi-tenant branding, preview panes and per-section accents are done. It needs no provider and works inside Server Components, because it is only CSS.

One caveat: Chrome keeps a *transitioned* property pinned to its old value when the custom property behind it changes on an ancestor. If you swap tokens at runtime and a colour appears stuck, set \`transition: none\` on the themed subtree.`,
};

function themingFor(topic: ThemingTopic): string {
  return THEMING[topic];
}

function setupFor(framework: "nextjs" | "vite" | "react"): string {
  const install = `\`\`\`bash\npnpm add ${PACKAGE_NAME}\n\`\`\`\n\nReact 18.2 or 19 is a peer dependency.`;

  if (framework === "nextjs") {
    return [
      "# Next.js App Router",
      "",
      install,
      "",
      "Import the stylesheet once in the root layout, above your own styles:",
      "",
      `\`\`\`tsx
// app/layout.tsx
import "${PACKAGE_NAME}/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
\`\`\``,
      "",
      "Then use components anywhere, including in Server Components:",
      "",
      `\`\`\`tsx
// app/page.tsx — no "use client" needed
import { Button, Card, CardBody } from "${PACKAGE_NAME}";

export default function Page() {
  return (
    <Card>
      <CardBody>
        <Button>Get started</Button>
      </CardBody>
    </Card>
  );
}
\`\`\``,
      "",
      "Do **not** add the package to `transpilePackages` — it ships compiled ESM already.",
      "",
      'Dark mode: set `data-theme="dark"` or the class `dark` on `<html>`. Both selectors ship.',
    ].join("\n");
  }

  const entry = framework === "vite" ? "src/main.tsx" : "your entry file";
  return [
    framework === "vite" ? "# Vite" : "# React",
    "",
    install,
    "",
    `Import the stylesheet once in ${entry}, above your own styles:`,
    "",
    `\`\`\`tsx
import "${PACKAGE_NAME}/styles.css";
import "./index.css";
\`\`\``,
    "",
    'Your `tsconfig.json` needs `"moduleResolution": "bundler"` (or `node16`/`nodenext`) for the subpath exports to resolve.',
    "",
    'Dark mode: set `data-theme="dark"` or the class `dark` on `<html>`. Both selectors ship.',
  ].join("\n");
}
