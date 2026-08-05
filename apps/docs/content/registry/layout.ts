import type { ComponentDoc } from "../types";

/** Layout and typography primitives. All render on the server. */
export const layoutComponents: ComponentDoc[] = [
  {
    slug: "box",
    name: "Box",
    category: "Layout",
    summary: "The lowest-level layout primitive.",
    description:
      "A styled element with token-bound spacing, surface, radius and elevation. Reach for Box when you need a container that respects the design system without inventing a new component for it.",
    exports: ["Box"],
    serverSafe: true,
    props: [
      {
        name: "as",
        type: '"div" | "span" | "section" | "article" | …',
        defaultValue: '"div"',
        description:
          "Element to render. A closed union rather than open polymorphism, which keeps prop errors readable.",
      },
      {
        name: "padding",
        type: "SpaceToken",
        description: "Padding on both axes, from the 4px spacing scale.",
      },
      {
        name: "paddingInline",
        type: "SpaceToken",
        description: "Horizontal padding. Overrides padding on that axis only.",
      },
      {
        name: "paddingBlock",
        type: "SpaceToken",
        description: "Vertical padding. Overrides padding on that axis only.",
      },
      {
        name: "background",
        type: '"none" | "default" | "subtle" | "raised" | "muted"',
        description: "Background surface role.",
      },
      {
        name: "radius",
        type: '"none" | "sm" | "md" | "lg" | "xl" | "full"',
        description: "Corner radius token.",
      },
      {
        name: "shadow",
        type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',
        description: "Elevation token.",
      },
      {
        name: "bordered",
        type: "boolean",
        defaultValue: "false",
        description: "Draws a one-pixel border using the current border token.",
      },
    ],
    examples: [
      {
        id: "box-basic",
        title: "Surfaces and spacing",
        description: "Every visual property maps to a token, never a raw value.",
        code: `<Box padding={5} background="subtle" radius="lg" bordered>
  Content on a subtle surface
</Box>`,
      },
    ],
    accessibility: [
      "Box renders a plain element and adds no ARIA of its own.",
      "Choose a meaningful element with `as` — `section`, `article`, `nav` — rather than leaving everything a div.",
    ],
  },
  {
    slug: "stack",
    name: "Stack",
    category: "Layout",
    summary: "Vertical layout with token spacing.",
    description:
      "Stacks children in a column with a gap from the spacing scale. Stack and Inline share one internal flex implementation, so their alignment props behave identically.",
    exports: ["Stack"],
    serverSafe: true,
    props: [
      { name: "gap", type: "SpaceToken", description: "Space between children." },
      {
        name: "align",
        type: '"start" | "center" | "end" | "stretch" | "baseline"',
        description: "Cross-axis alignment.",
      },
      {
        name: "justify",
        type: '"start" | "center" | "end" | "between" | "around" | "evenly"',
        description: "Main-axis distribution.",
      },
      {
        name: "fullWidth",
        type: "boolean",
        defaultValue: "false",
        description: "Stretch to fill the container's inline size.",
      },
    ],
    examples: [
      {
        id: "stack-basic",
        title: "Vertical rhythm",
        code: `<Stack gap={3}>
  <Text>First</Text>
  <Text>Second</Text>
  <Text>Third</Text>
</Stack>`,
      },
    ],
    accessibility: [
      "Purely presentational; contributes no semantics.",
      'Use `as="ul"` when the stacked items are genuinely a list.',
    ],
  },
  {
    slug: "inline",
    name: "Inline",
    category: "Layout",
    summary: "Horizontal layout that wraps by default.",
    description:
      "Arranges children in a row. Wrapping is on by default because a horizontal row that cannot wrap is the usual cause of overflow on narrow viewports.",
    exports: ["Inline"],
    serverSafe: true,
    props: [
      { name: "gap", type: "SpaceToken", description: "Space between children." },
      {
        name: "wrap",
        type: "boolean",
        defaultValue: "true",
        description: "Allow children to wrap onto additional lines.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end" | "stretch" | "baseline"',
        defaultValue: '"center"',
        description: "Cross-axis alignment.",
      },
      {
        name: "justify",
        type: '"start" | "center" | "end" | "between" | "around" | "evenly"',
        description: "Main-axis distribution.",
      },
    ],
    examples: [
      {
        id: "inline-basic",
        title: "Row of controls",
        code: `<Inline gap={2}>
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</Inline>`,
      },
    ],
    accessibility: ["Purely presentational; contributes no semantics."],
  },
  {
    slug: "container",
    name: "Container",
    category: "Layout",
    summary: "Centres content and caps its measure.",
    description:
      "Constrains content width and centres it, with responsive inline padding so text never touches the viewport edge.",
    exports: ["Container"],
    serverSafe: true,
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "full"',
        defaultValue: '"lg"',
        description: "Maximum inline size.",
      },
      {
        name: "padded",
        type: "boolean",
        defaultValue: "true",
        description: "Adds responsive inline padding.",
      },
    ],
    examples: [
      {
        id: "container-basic",
        title: "Constrained measure",
        code: `<Container size="sm">
  <Text>Long-form text stays readable at a comfortable measure.</Text>
</Container>`,
      },
    ],
    accessibility: ["Purely presentational; contributes no semantics."],
  },
  {
    slug: "grid",
    name: "Grid",
    category: "Layout",
    summary: "Two-dimensional layout.",
    description:
      "A CSS grid with token-based gaps. Prefer `minItemWidth` over a fixed column count: it produces a track list that reflows on its own, with no media queries to maintain.",
    exports: ["Grid"],
    serverSafe: true,
    props: [
      {
        name: "columns",
        type: "number",
        description: "Fixed number of equal columns. Ignored when minItemWidth is set.",
      },
      { name: "gap", type: "SpaceToken", description: "Space between grid items." },
      {
        name: "minItemWidth",
        type: "string",
        description:
          'Minimum width per item, e.g. "16rem". Produces a self-reflowing grid.',
      },
    ],
    examples: [
      {
        id: "grid-responsive",
        title: "Self-reflowing grid",
        description: "Resize the preview — no breakpoints are involved.",
        code: `<Grid minItemWidth="12rem" gap={4}>
  <Card><CardBody>One</CardBody></Card>
  <Card><CardBody>Two</CardBody></Card>
  <Card><CardBody>Three</CardBody></Card>
</Grid>`,
      },
    ],
    accessibility: [
      "Grid does not change reading order; DOM order is what screen readers and keyboard users follow.",
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Layout",
    summary: "A visual or semantic dividing rule.",
    description:
      "Decorative by default. Screen readers already convey structure through headings and landmarks, so most rules are noise when announced — set `decorative={false}` only when the divide carries real meaning.",
    exports: ["Separator"],
    serverSafe: true,
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Axis the rule runs along.",
      },
      {
        name: "decorative",
        type: "boolean",
        defaultValue: "true",
        description: "When true the rule is removed from the accessibility tree.",
      },
    ],
    examples: [
      {
        id: "separator-basic",
        title: "Dividing content",
        code: `<Stack gap={4}>
  <Text>Above</Text>
  <Separator />
  <Text>Below</Text>
</Stack>`,
      },
    ],
    accessibility: [
      'Decorative separators render `role="none"` and are skipped by screen readers.',
      'Semantic separators render `role="separator"`, with `aria-orientation` set when vertical.',
    ],
  },
  {
    slug: "visually-hidden",
    name: "VisuallyHidden",
    category: "Layout",
    summary: "Available to screen readers, invisible on screen.",
    description:
      "For labels that are obvious visually but absent semantically — an icon button's purpose, or a heading implied by surrounding layout. Uses clipping rather than `display: none`, which would hide the content from assistive technology too.",
    exports: ["VisuallyHidden"],
    serverSafe: true,
    props: [
      {
        name: "as",
        type: '"span" | "div" | "label" | "legend"',
        defaultValue: '"span"',
        description: "Element to render.",
      },
    ],
    examples: [
      {
        id: "visually-hidden-basic",
        title: "Hidden heading",
        code: `<VisuallyHidden as="div">
  Section heading for screen readers
</VisuallyHidden>`,
      },
    ],
    accessibility: [
      "Content stays in the accessibility tree and in the document's reading order.",
      "Never put interactive controls inside unless they become visible on focus.",
    ],
  },
];
