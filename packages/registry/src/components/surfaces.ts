import type { ComponentDoc } from "../types.js";

/** Data display, feedback and overlay components. */
export const surfaceComponents: ComponentDoc[] = [
  {
    slug: "card",
    name: "Card",
    category: "Data display",
    summary: "A grouped surface for related content.",
    description:
      "Three visual treatments and an optional interactive state. `interactive` styles the card only — put a real link or button inside for the interaction, because a clickable div is unreachable by keyboard.",
    exports: ["Card", "CardHeader", "CardBody", "CardFooter"],
    serverSafe: true,
    props: [
      {
        name: "variant",
        type: '"outlined" | "elevated" | "filled"',
        defaultValue: '"outlined"',
        description: "Visual treatment.",
      },
      {
        name: "interactive",
        type: "boolean",
        defaultValue: "false",
        description: "Adds hover and focus affordances for cards that lead somewhere.",
      },
      {
        name: "as",
        type: '"div" | "article" | "section" | "li"',
        defaultValue: '"div"',
        description: "Element to render.",
      },
    ],
    examples: [
      {
        id: "card-variants",
        title: "Variants",
        code: `<Grid minItemWidth="13rem" gap={4}>
  <Card variant="outlined"><CardBody>Outlined</CardBody></Card>
  <Card variant="elevated"><CardBody>Elevated</CardBody></Card>
  <Card variant="filled"><CardBody>Filled</CardBody></Card>
</Grid>`,
      },
      {
        id: "card-composed",
        title: "Header, body and footer",
        code: `<Card variant="elevated">
  <CardHeader>
    <Heading level={3} size="md">Monthly report</Heading>
    <Text size="sm" tone="muted">Generated 4 August</Text>
  </CardHeader>
  <CardBody>
    <Text>Contributions rose 12% against the previous period.</Text>
  </CardBody>
  <CardFooter divided>
    <Button size="sm">Download</Button>
    <Button size="sm" variant="ghost">Share</Button>
  </CardFooter>
</Card>`,
      },
    ],
    accessibility: [
      "The focus ring is driven by `:focus-within`, so it appears when the control inside the card is focused.",
      "Never attach a click handler to the card itself — keyboard users cannot reach it.",
      'Use `as="article"` or `as="li"` when the card is a real content item.',
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Data display",
    summary: "A short status or category marker.",
    description:
      "Seven tones across three variants. Because a badge's meaning is usually carried by its colour, `srLabel` lets you supply the words that colour stands for.",
    exports: ["Badge"],
    serverSafe: true,
    props: [
      {
        name: "tone",
        type: '"neutral" | "primary" | "accent" | "success" | "warning" | "danger" | "info"',
        defaultValue: '"neutral"',
        description: "Semantic colour role.",
      },
      {
        name: "variant",
        type: '"subtle" | "solid" | "outline"',
        defaultValue: '"subtle"',
        description: "Visual treatment.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Size.",
      },
      {
        name: "dot",
        type: "boolean",
        defaultValue: "false",
        description: "Shows a leading status dot.",
      },
      {
        name: "srLabel",
        type: "string",
        description:
          "Text announced before the label, for when the tone carries the meaning.",
      },
    ],
    examples: [
      {
        id: "badge-tones",
        title: "Tones",
        code: `<Inline gap={2}>
  <Badge>Neutral</Badge>
  <Badge tone="primary">Primary</Badge>
  <Badge tone="success" dot>Active</Badge>
  <Badge tone="warning">Pending</Badge>
  <Badge tone="danger" srLabel="Status:">Overdue</Badge>
</Inline>`,
      },
      {
        id: "badge-variants",
        title: "Variants",
        code: `<Inline gap={2}>
  <Badge tone="primary" variant="subtle">Subtle</Badge>
  <Badge tone="primary" variant="solid">Solid</Badge>
  <Badge tone="primary" variant="outline">Outline</Badge>
</Inline>`,
      },
    ],
    accessibility: [
      "Colour is not available to screen readers — use `srLabel` where the tone is the message.",
      "The status dot is `aria-hidden`; it is decoration.",
      "Every tone and variant pairing meets WCAG AA for text contrast.",
    ],
  },
  {
    slug: "alert",
    name: "Alert",
    category: "Feedback",
    summary: "A prominent inline message.",
    description:
      'Tone drives the ARIA role. `danger` and `warning` use `role="alert"`, which interrupts a screen reader immediately; `info` and `success` use `role="status"`, which waits for a pause. Getting this backwards either buries an error or hijacks the user mid-sentence for something trivial.',
    exports: ["Alert"],
    serverSafe: false,
    props: [
      {
        name: "tone",
        type: '"info" | "success" | "warning" | "danger"',
        defaultValue: '"info"',
        description: "Semantic role of the message.",
      },
      { name: "title", type: "ReactNode", description: "Short headline." },
      {
        name: "icon",
        type: "ReactNode",
        description: "Replaces the built-in tone icon.",
      },
      {
        name: "onDismiss",
        type: "() => void",
        description: "Renders a close button and calls this when activated.",
      },
      {
        name: "dismissLabel",
        type: "string",
        defaultValue: '"Dismiss"',
        description: "Accessible name for the close button.",
      },
    ],
    examples: [
      {
        id: "alert-tones",
        title: "Tones",
        code: `<Stack gap={3}>
  <Alert tone="info" title="Scheduled maintenance">
    The service will be unavailable on Sunday from 02:00.
  </Alert>
  <Alert tone="success" title="Saved">Your changes are live.</Alert>
  <Alert tone="warning" title="Approaching your limit">
    You have used 92% of your quota.
  </Alert>
  <Alert tone="danger" title="Payment failed">
    Update your card details to continue.
  </Alert>
</Stack>`,
      },
      {
        id: "alert-dismissible",
        title: "Dismissible",
        code: `<Alert tone="info" title="Tip" onDismiss={() => setVisible(false)}>
  You can dismiss this message.
</Alert>`,
      },
    ],
    accessibility: [
      'Urgent tones use `role="alert"` with `aria-live="assertive"`.',
      'Non-urgent tones use `role="status"` with `aria-live="polite"`.',
      "The tone icon is `aria-hidden`; it duplicates information already in the text.",
      "The close button carries an accessible name, configurable via `dismissLabel`.",
    ],
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Feedback",
    summary: "An indeterminate loading indicator.",
    description:
      "Inherits `currentColor`, so it adopts the text colour of whatever it sits inside. Under `prefers-reduced-motion` it degrades to a static ring rather than disappearing — the user still needs to know something is busy.",
    exports: ["Spinner"],
    serverSafe: true,
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Diameter.",
      },
      {
        name: "label",
        type: "string | null",
        defaultValue: '"Loading"',
        description:
          "Accessible label. Pass null inside a control that already announces its busy state.",
      },
    ],
    examples: [
      {
        id: "spinner-sizes",
        title: "Sizes",
        code: `<Inline gap={4}>
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</Inline>`,
      },
    ],
    accessibility: [
      'Announced as `role="status"` with a label by default.',
      "Passing `label={null}` removes it from the accessibility tree, avoiding a double announcement inside an `aria-busy` button.",
      "Honours `prefers-reduced-motion` by stopping the animation, not by hiding.",
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Overlays",
    summary: "A modal dialog.",
    description:
      "Focus trapping, focus restoration, scroll locking and Escape handling come from Radix — behaviour that is genuinely difficult to get right and where hand-rolled versions reliably produce accessibility bugs. Everything visible is ABBA's.",
    exports: [
      "Dialog",
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogTitle",
      "DialogDescription",
      "DialogBody",
      "DialogFooter",
      "DialogClose",
    ],
    serverSafe: false,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state. Omit for uncontrolled use.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Called when the open state should change.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Initial open state when uncontrolled.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        defaultValue: '"md"',
        description: "Maximum width, set on DialogContent.",
      },
      {
        name: "showCloseButton",
        type: "boolean",
        defaultValue: "true",
        description: "Renders the built-in close button. Set on DialogContent.",
      },
    ],
    examples: [
      {
        id: "dialog-basic",
        title: "Confirmation dialog",
        description:
          "Open it, then press Tab repeatedly — focus never leaves. Escape closes and returns focus to the trigger.",
        code: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="danger">Delete project</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete this project?</DialogTitle>
      <DialogDescription>
        This permanently removes the project and all of its data.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="danger">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      },
    ],
    accessibility: [
      "Focus moves into the dialog on open and returns to the trigger on close.",
      "Tab is trapped inside while open.",
      "Escape closes the dialog.",
      "Content outside is marked `aria-hidden`, so screen readers cannot wander out.",
      "Always render a DialogTitle — without it the dialog is announced only as “dialog”.",
      "Body scroll is locked while open.",
    ],
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    category: "Overlays",
    summary: "A menu of actions launched from a button.",
    description:
      "Roving focus, type-ahead, arrow-key navigation and collision-aware positioning come from Radix. Items support a danger tone for destructive actions and an optional keyboard-shortcut hint.",
    exports: [
      "DropdownMenu",
      "DropdownMenuTrigger",
      "DropdownMenuContent",
      "DropdownMenuItem",
      "DropdownMenuLabel",
      "DropdownMenuSeparator",
      "DropdownMenuShortcut",
      "DropdownMenuGroup",
    ],
    serverSafe: false,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state. Omit for uncontrolled use.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Called when the open state should change.",
      },
      {
        name: "tone",
        type: '"default" | "danger"',
        defaultValue: '"default"',
        description: "Styles an item as a destructive action. Set on DropdownMenuItem.",
      },
      {
        name: "sideOffset",
        type: "number",
        defaultValue: "6",
        description: "Distance from the trigger. Set on DropdownMenuContent.",
      },
    ],
    examples: [
      {
        id: "dropdown-basic",
        title: "Action menu",
        description:
          "Open it with Enter, then navigate with the arrow keys — disabled items are skipped automatically.",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Manage</DropdownMenuLabel>
    <DropdownMenuItem>
      Edit<DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem disabled>Archive</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      },
    ],
    accessibility: [
      "Arrow keys move between items; disabled items are skipped.",
      "Typing letters jumps to the matching item.",
      "Escape closes the menu and returns focus to the trigger.",
      "The trigger reports `aria-expanded` and `aria-haspopup`.",
      "Shortcut hints are `aria-hidden`, so item names are not padded with “Ctrl E”.",
      "The menu repositions to stay within the viewport.",
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Overlays",
    summary: "Switches between panels of related content.",
    description:
      "Two visual treatments. The variant is read from context rather than taken as a prop on the list, so the root and the list can never disagree.",
    exports: ["Tabs", "TabsList", "TabsTrigger", "TabsPanel"],
    serverSafe: false,
    props: [
      {
        name: "variant",
        type: '"line" | "enclosed"',
        defaultValue: '"line"',
        description: "Visual treatment of the tab list.",
      },
      {
        name: "defaultValue",
        type: "string",
        description: "Initially active tab when uncontrolled.",
      },
      { name: "value", type: "string", description: "Controlled active tab." },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Called when the active tab changes.",
      },
    ],
    examples: [
      {
        id: "tabs-basic",
        title: "Line and enclosed",
        code: `<Tabs defaultValue="overview">
  <TabsList aria-label="Project sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsPanel value="overview">Overview content</TabsPanel>
  <TabsPanel value="activity">Activity content</TabsPanel>
  <TabsPanel value="settings">Settings content</TabsPanel>
</Tabs>`,
      },
    ],
    accessibility: [
      "Arrow keys move between tabs; Tab enters the list once and then moves to the panel (roving tabindex).",
      "Each tab is wired to its panel with `aria-controls` and `aria-labelledby`.",
      "Give TabsList an `aria-label` so the tab set is identifiable.",
      "Many tabs scroll horizontally on narrow viewports rather than wrapping into a broken grid.",
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Overlays",
    summary: "Transient notifications.",
    description:
      "Mount ToastProvider once near your application root, then call `toast()` from the `useToast()` hook anywhere below it. Radix supplies the live region, the swipe-to-dismiss gesture, and the F8 hotkey that moves focus into the viewport so keyboard users can reach an action before it disappears.",
    exports: ["ToastProvider", "useToast"],
    serverSafe: false,
    props: [
      {
        name: "duration",
        type: "number",
        defaultValue: "5000",
        description: "Milliseconds before auto-dismiss. Set on ToastProvider.",
      },
      {
        name: "title",
        type: "ReactNode",
        required: true,
        description: "Short headline. Passed to toast().",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "Supporting detail. Passed to toast().",
      },
      {
        name: "tone",
        type: '"info" | "success" | "warning" | "danger"',
        defaultValue: '"info"',
        description: "Semantic role. Passed to toast().",
      },
      {
        name: "action",
        type: "{ label: string; onClick: () => void }",
        description: "An optional single action. Passed to toast().",
      },
    ],
    examples: [
      {
        id: "toast-basic",
        title: "Publishing a toast",
        description:
          "Press F8 while one is visible to move focus into the notification.",
        code: `// Mount once, near the application root:
<ToastProvider>{children}</ToastProvider>

// Then anywhere below it:
const { toast } = useToast();

toast({
  title: "Changes saved",
  description: "Your profile is up to date.",
  tone: "success",
  action: { label: "Undo", onClick: revert },
});`,
      },
    ],
    accessibility: [
      "Toasts publish into an ARIA live region, so they are announced without stealing focus.",
      "F8 moves focus into the toast viewport to reach actions by keyboard.",
      "Each toast has a labelled close button and can be swiped away.",
      "Actions carry `altText` for when the toast is announced but cannot be reached in time.",
      "`useToast` throws outside a provider rather than silently doing nothing.",
    ],
  },
];
