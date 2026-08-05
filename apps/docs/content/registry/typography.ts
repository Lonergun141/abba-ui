import type { ComponentDoc } from "../types";

/** Typography primitives. All render on the server. */
export const typographyComponents: ComponentDoc[] = [
  {
    slug: "text",
    name: "Text",
    category: "Typography",
    summary: "Body copy at a token-bound size and tone.",
    description:
      "The default way to render prose. Size, weight, tone and line height all resolve to tokens, so a theme change moves the whole system at once.",
    exports: ["Text"],
    serverSafe: true,
    props: [
      {
        name: "as",
        type: '"p" | "span" | "div" | "strong" | "em" | "small" | …',
        defaultValue: '"p"',
        description: "Element to render.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl"',
        defaultValue: '"md"',
        description: "Type scale step.",
      },
      {
        name: "weight",
        type: '"regular" | "medium" | "semibold" | "bold"',
        defaultValue: '"regular"',
        description: "Font weight.",
      },
      {
        name: "tone",
        type: '"default" | "muted" | "primary" | "accent" | "success" | "warning" | "danger"',
        defaultValue: '"default"',
        description: "Semantic colour role.",
      },
      {
        name: "leading",
        type: '"tight" | "snug" | "normal" | "relaxed"',
        defaultValue: '"normal"',
        description: "Line height.",
      },
      {
        name: "truncate",
        type: "boolean",
        defaultValue: "false",
        description: "Truncate to a single line with an ellipsis.",
      },
    ],
    examples: [
      {
        id: "text-tones",
        title: "Sizes and tones",
        code: `<Stack gap={2}>
  <Text size="lg">Large body copy</Text>
  <Text tone="muted">Muted supporting text</Text>
  <Text tone="danger" weight="medium">Something went wrong</Text>
</Stack>`,
      },
    ],
    accessibility: [
      "Tone is colour alone. Where the colour carries the meaning, repeat it in words.",
      "Truncated text is still fully available to screen readers; only the visual line is clipped.",
    ],
  },
  {
    slug: "heading",
    name: "Heading",
    category: "Typography",
    summary: "Section headings with rank separate from size.",
    description:
      "`level` sets the heading rank and therefore the document outline; `size` sets the visual weight. Keeping them independent means you never have to pick the wrong rank to get the right size.",
    exports: ["Heading"],
    serverSafe: true,
    props: [
      {
        name: "level",
        type: "1 | 2 | 3 | 4 | 5 | 6",
        defaultValue: "2",
        description: "Heading rank, rendered as the matching h1–h6 element.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "display"',
        description: "Visual size. Defaults to a sensible size for the level.",
      },
      {
        name: "tone",
        type: '"default" | "muted" | "primary"',
        defaultValue: '"default"',
        description: "Semantic colour role.",
      },
    ],
    examples: [
      {
        id: "heading-levels",
        title: "Rank and size are independent",
        description:
          "This h3 is styled at display size without disturbing the outline.",
        code: `<Stack gap={3}>
  <Heading level={1}>Page title</Heading>
  <Heading level={2}>Section</Heading>
  <Heading level={3} size="display">Visually large, still an h3</Heading>
</Stack>`,
      },
    ],
    accessibility: [
      "Pick `level` for the document structure, never for the font size.",
      "Do not skip ranks — an h2 followed by an h4 breaks heading navigation.",
    ],
  },
  {
    slug: "label",
    name: "Label",
    category: "Typography",
    summary: "A caption for a form control.",
    description:
      "Renders a real `<label>`, so clicking it focuses the associated control through the platform rather than through a click handler. FormField renders this for you.",
    exports: ["Label"],
    serverSafe: true,
    props: [
      {
        name: "htmlFor",
        type: "string",
        description: "Id of the control this labels.",
      },
      {
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description: "Marks the associated control as required.",
      },
      {
        name: "requiredLabel",
        type: "string",
        defaultValue: '"required"',
        description: "Text announced in place of the asterisk.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Dims the label to match a disabled control.",
      },
    ],
    examples: [
      {
        id: "label-basic",
        title: "Required field",
        description: "The asterisk is decorative; the word is what gets announced.",
        code: `<Stack gap={2}>
  <Label htmlFor="email" required>Email address</Label>
  <Input id="email" type="email" />
</Stack>`,
      },
    ],
    accessibility: [
      "The asterisk is `aria-hidden`; a visually-hidden “required” is announced instead.",
      "Always pair with `htmlFor` — a label with no association is decoration.",
    ],
  },
  {
    slug: "code",
    name: "Code",
    category: "Typography",
    summary: "Monospaced source text, inline or block.",
    description:
      "Inline code sits within a sentence. Block code renders inside a `<pre>` so whitespace and line breaks survive, and scrolls horizontally rather than widening the page.",
    exports: ["Code"],
    serverSafe: true,
    props: [
      {
        name: "variant",
        type: '"inline" | "block"',
        defaultValue: '"inline"',
        description: "Inline within prose, or a standalone block.",
      },
    ],
    examples: [
      {
        id: "code-basic",
        title: "Inline and block",
        code: `<Stack gap={3}>
  <Text>Run <Code>pnpm install</Code> to begin.</Text>
  <Code variant="block">{\`const theme = "dark";\`}</Code>
</Stack>`,
      },
    ],
    accessibility: [
      "Long block content scrolls inside its own container, so the page body never scrolls horizontally.",
    ],
  },
  {
    slug: "link",
    name: "Link",
    category: "Typography",
    summary: "A navigational hyperlink.",
    description:
      'Renders a plain anchor, so it composes with any router. External links get `rel="noopener noreferrer"`, an arrow glyph, and visually-hidden text announcing the new tab.',
    exports: ["Link"],
    serverSafe: true,
    props: [
      {
        name: "underline",
        type: '"always" | "hover" | "none"',
        defaultValue: '"hover"',
        description: "Underline behaviour.",
      },
      {
        name: "external",
        type: "boolean",
        defaultValue: "false",
        description:
          "Opens in a new tab with a safe rel, an icon, and an announcement.",
      },
      {
        name: "externalLabel",
        type: "string",
        defaultValue: '"(opens in a new tab)"',
        description: "Text announced after an external link's label.",
      },
    ],
    examples: [
      {
        id: "link-basic",
        title: "Internal and external",
        code: `<Inline gap={4}>
  <Link href="/docs">Documentation</Link>
  <Link href="https://example.com" external>External site</Link>
</Inline>`,
      },
    ],
    accessibility: [
      "External links announce that they open a new tab, rather than only showing an icon.",
      "`noopener` prevents the opened page reaching back through `window.opener`.",
      "Link text should make sense out of context — avoid “click here”.",
    ],
  },
];
