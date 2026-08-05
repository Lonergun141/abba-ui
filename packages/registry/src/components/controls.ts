import type { ComponentDoc } from "../types.js";

/** Actions and form controls. These establish client boundaries. */
export const controlComponents: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    category: "Actions",
    summary: "The primary action control.",
    description:
      "Renders a real `<button>`, so form submission, Enter and Space activation, and the disabled state come from the platform rather than from re-implemented event handlers. Five variants, three sizes, plus a loading state that keeps the button's width stable so surrounding content does not jump.",
    exports: ["Button"],
    serverSafe: false,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
        defaultValue: '"primary"',
        description: "Visual weight.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Control height and typography.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "Shows a spinner, hides the label, and blocks interaction.",
      },
      {
        name: "loadingLabel",
        type: "string",
        defaultValue: '"Loading"',
        description: "Accessible description of what is loading.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Renders the single child element instead of a button, merging props onto it. Use for links styled as buttons.",
      },
      {
        name: "leftIcon",
        type: "ReactNode",
        description: "Element before the label. Hidden from assistive technology.",
      },
      {
        name: "rightIcon",
        type: "ReactNode",
        description: "Element after the label. Hidden from assistive technology.",
      },
      {
        name: "fullWidth",
        type: "boolean",
        defaultValue: "false",
        description: "Stretches to the width of its container.",
      },
    ],
    examples: [
      {
        id: "button-variants",
        title: "Variants",
        code: `<Inline gap={2}>
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
</Inline>`,
      },
      {
        id: "button-sizes",
        title: "Sizes",
        code: `<Inline gap={2}>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</Inline>`,
      },
      {
        id: "button-states",
        title: "States",
        description:
          "The loading button keeps its label in the layout, so its width does not change.",
        code: `<Inline gap={2}>
  <Button loading>Saving</Button>
  <Button disabled>Disabled</Button>
  <Button asChild><a href="#button">As a link</a></Button>
</Inline>`,
      },
    ],
    accessibility: [
      "Always a native button, so Enter and Space activation come from the browser.",
      "`loading` sets `aria-busy` and disables the control; the spinner carries an accessible label.",
      "Icons are wrapped in `aria-hidden`, keeping the accessible name to the label alone.",
      "With `asChild`, `aria-disabled` is used because anchors have no disabled attribute.",
      "Focus is shown with an `outline`, which does not shift layout the way a border would.",
    ],
  },
  {
    slug: "icon-button",
    name: "IconButton",
    category: "Actions",
    summary: "A square button containing only an icon.",
    description:
      "Built on Button rather than duplicating its variant, size, focus and loading behaviour. `aria-label` is a required prop, because an icon alone conveys nothing to a screen reader.",
    exports: ["IconButton"],
    serverSafe: false,
    props: [
      {
        name: "icon",
        type: "ReactNode",
        required: true,
        description: "The icon to render. Hidden from assistive technology.",
      },
      {
        name: "aria-label",
        type: "string",
        required: true,
        description: "Accessible name for the control. Not optional.",
      },
      {
        name: "round",
        type: "boolean",
        defaultValue: "false",
        description: "Use a fully rounded shape.",
      },
    ],
    examples: [
      {
        id: "icon-button-basic",
        title: "Variants and shapes",
        code: `<Inline gap={2}>
  <IconButton aria-label="Add item" icon={<PlusIcon />} />
  <IconButton aria-label="Add item" variant="outline" icon={<PlusIcon />} />
  <IconButton aria-label="Add item" variant="ghost" round icon={<PlusIcon />} />
</Inline>`,
      },
    ],
    accessibility: [
      "`aria-label` is required by the type signature — the component will not compile without one.",
      "The icon is wrapped in `aria-hidden`, so the label is the entire accessible name.",
      "Inherits Button's focus, disabled and loading behaviour unchanged.",
    ],
  },
  {
    slug: "button-group",
    name: "ButtonGroup",
    category: "Actions",
    summary: "Groups related buttons into one control.",
    description:
      "Joins buttons visually by collapsing the radii and borders between them, while leaving each one an independently focusable button.",
    exports: ["ButtonGroup"],
    serverSafe: true,
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Layout axis.",
      },
      {
        name: "attached",
        type: "boolean",
        defaultValue: "true",
        description: "Join the buttons into a single visual control.",
      },
      {
        name: "aria-label",
        type: "string",
        description: "Accessible name for the group. Strongly recommended.",
      },
    ],
    examples: [
      {
        id: "button-group-basic",
        title: "Attached and spaced",
        code: `<Stack gap={4}>
  <ButtonGroup aria-label="Text alignment">
    <Button variant="outline">Left</Button>
    <Button variant="outline">Centre</Button>
    <Button variant="outline">Right</Button>
  </ButtonGroup>
  <ButtonGroup aria-label="Actions" attached={false}>
    <Button>Save</Button>
    <Button variant="ghost">Cancel</Button>
  </ButtonGroup>
</ButtonGroup>`,
      },
    ],
    accessibility: [
      'Renders `role="group"`; supply `aria-label` or the announcement is meaningless.',
      "Every button stays individually reachable with Tab.",
      "The focused button's ring is raised above its neighbours so it is never clipped.",
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "Forms",
    summary: "A single-line text field.",
    description:
      "Renders a real `<input>`, so form association, validation, autofill and IME behaviour come from the platform. Uncontrolled by default — pass `value` with `onChange` to control it.",
    exports: ["Input"],
    serverSafe: false,
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Control height. Renamed from the native size attribute, which counts characters.",
      },
      {
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description: "Marks the field as failing validation.",
      },
      {
        name: "prefix",
        type: "ReactNode",
        description: "Decorative content inside the leading edge.",
      },
      {
        name: "suffix",
        type: "ReactNode",
        description: "Decorative content inside the trailing edge.",
      },
    ],
    examples: [
      {
        id: "input-basic",
        title: "Sizes and affixes",
        code: `<Stack gap={3}>
  <Input aria-label="Small" size="sm" placeholder="Small" />
  <Input aria-label="Medium" placeholder="Medium" />
  <Input aria-label="Amount" prefix="₱" suffix=".00" placeholder="0" />
</Stack>`,
      },
      {
        id: "input-invalid",
        title: "Invalid state",
        code: `<Input aria-label="Email" invalid defaultValue="not-an-email" />`,
      },
    ],
    accessibility: [
      "The invalid state sets `aria-invalid`, so it is heard and not merely seen as a red border.",
      "Affixes are `aria-hidden`; they are decoration, not part of the field's name.",
      "Pair with FormField, or supply `aria-label`, so the field is never unnamed.",
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Forms",
    summary: "A multi-line text field.",
    description:
      "The multi-line counterpart to Input. `autoSize` grows the control with its content using CSS `field-sizing` rather than measuring scrollHeight in an effect, so there is no layout thrash and it is correct on first paint.",
    exports: ["Textarea"],
    serverSafe: false,
    props: [
      {
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description: "Marks the field as failing validation.",
      },
      {
        name: "resize",
        type: '"none" | "vertical" | "both"',
        defaultValue: '"vertical"',
        description: "Resize affordance offered to the user.",
      },
      {
        name: "autoSize",
        type: "boolean",
        defaultValue: "false",
        description: "Grow to fit content via CSS field-sizing.",
      },
    ],
    examples: [
      {
        id: "textarea-basic",
        title: "Default and auto-sizing",
        code: `<Stack gap={3}>
  <Textarea aria-label="Notes" placeholder="Write a note…" />
  <Textarea aria-label="Auto" autoSize placeholder="This one grows as you type" />
</Stack>`,
      },
    ],
    accessibility: [
      "The invalid state sets `aria-invalid`.",
      'Avoid `resize="none"` unless the layout genuinely cannot tolerate it — it removes a real user affordance.',
    ],
  },
  {
    slug: "form-field",
    name: "FormField",
    category: "Forms",
    summary: "Binds a label, helper text and error to a control.",
    description:
      "The value here is the wiring, not the layout. FormField generates stable ids with `useId` and connects them through `htmlFor` and `aria-describedby` — the part hand-written forms almost always get wrong. Anything you set explicitly on the child wins.",
    exports: ["FormField"],
    serverSafe: false,
    props: [
      {
        name: "label",
        type: "ReactNode",
        description: "Visible caption for the control.",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "Helper text describing the expected input.",
      },
      {
        name: "error",
        type: "ReactNode",
        description:
          "Validation failure. Its presence puts the control into the invalid state.",
      },
      {
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description: "Marks the control required, visually and in its props.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Dims the label and disables the control.",
      },
      {
        name: "children",
        type: "ReactElement",
        required: true,
        description: "Exactly one form control.",
      },
    ],
    examples: [
      {
        id: "form-field-basic",
        title: "Label, description and error",
        description:
          "Focus the field with a screen reader running: the label, then the description, then the error are announced in order.",
        code: `<Stack gap={5}>
  <FormField label="Email address" description="We only use this to sign you in." required>
    <Input type="email" placeholder="you@example.com" />
  </FormField>

  <FormField label="Username" error="That username is already taken.">
    <Input defaultValue="ada" />
  </FormField>
</Stack>`,
      },
    ],
    accessibility: [
      "`htmlFor` and the control's `id` are generated together, so clicking the label focuses the field.",
      "Description and error ids are joined into `aria-describedby` in reading order.",
      'An error sets `aria-invalid` on the control and renders the message with `role="alert"`.',
      "Ids come from `useId`, which is stable across server and client, so the association survives hydration.",
      "An explicit `id` or `aria-describedby` on the child is never overwritten.",
    ],
  },
  {
    slug: "form-message",
    name: "FormMessage",
    category: "Forms",
    summary: "Helper, error or confirmation text.",
    description:
      "Usually rendered by FormField, which also wires the `aria-describedby` relationship. Exported separately for forms built by hand.",
    exports: ["FormMessage"],
    serverSafe: true,
    props: [
      {
        name: "tone",
        type: '"description" | "error" | "success"',
        defaultValue: '"description"',
        description: "Meaning of the message.",
      },
      {
        name: "live",
        type: "boolean",
        description:
          "Announce the message as it appears. Defaults to true for the error tone.",
      },
    ],
    examples: [
      {
        id: "form-message-basic",
        title: "Tones",
        code: `<Stack gap={2}>
  <FormMessage>Use your work address.</FormMessage>
  <FormMessage tone="error">This field is required.</FormMessage>
  <FormMessage tone="success">Looks good.</FormMessage>
</Stack>`,
      },
    ],
    accessibility: [
      "Errors are live by default: a validation failure shown only visually is invisible to a screen-reader user who has moved past the field.",
      "Descriptions are not live, so they do not interrupt while typing.",
    ],
  },
];
