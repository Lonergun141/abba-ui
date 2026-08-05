# ABBA UI

React components for Next.js and plain React. No Tailwind, no provider, no config.

**[Live docs →](https://abba-ui.vercel.app)**

---

## Use it in your project

### 1. Install

```bash
pnpm add @abbainitiative/ui
```

<sub>`npm install @abbainitiative/ui` · `yarn add @abbainitiative/ui` · `bun add @abbainitiative/ui`</sub>

### 2. Import the stylesheet once

**Next.js** — in `app/layout.tsx`:

```tsx
import "@abbainitiative/ui/styles.css";
```

**Vite / CRA / anything else** — in `src/main.tsx`:

```tsx
import "@abbainitiative/ui/styles.css";
```

Put it _above_ your own stylesheet imports so your overrides win.

### 3. Use the components

```tsx
import { Button, Card, CardBody, Heading, Stack } from "@abbainitiative/ui";

export default function Page() {
  return (
    <Card variant="elevated">
      <CardBody>
        <Stack gap={4}>
          <Heading level={1}>Welcome back</Heading>
          <Button>Get started</Button>
        </Stack>
      </CardBody>
    </Card>
  );
}
```

That's it. No `transpilePackages`, no PostCSS plugin, no theme provider.

---

## Component reference

Import any of these from `@abbainitiative/ui`.

### Layout

```tsx
<Box padding={5} background="subtle" radius="lg" bordered>…</Box>
<Stack gap={4} align="start">…</Stack>          // vertical
<Inline gap={2} justify="between">…</Inline>    // horizontal, wraps
<Container size="md">…</Container>              // centred, capped width
<Grid minItemWidth="14rem" gap={4}>…</Grid>     // responsive columns
<Separator />
<VisuallyHidden>Screen-reader only</VisuallyHidden>
```

`gap` and `padding` take numbers from the spacing scale: `1 2 3 4 5 6 8 10 12 16 20 24`.

### Typography

```tsx
<Text size="sm" tone="muted" weight="medium">Body copy</Text>
<Heading level={2} size="lg">Section</Heading>   // rank and size are separate
<Label htmlFor="email" required>Email</Label>
<Code>pnpm install</Code>
<Code variant="block">{`const x = 1;`}</Code>
<Link href="/docs" external>Docs</Link>
```

`Text` tones: `default` `muted` `primary` `accent` `success` `warning` `danger`

### Buttons

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="danger" loading>Deleting</Button>
<Button leftIcon={<PlusIcon />} fullWidth>Add item</Button>

// Render as a link instead of a button:
<Button asChild>
  <Link href="/signup">Sign up</Link>
</Button>

<IconButton aria-label="Delete" icon={<TrashIcon />} variant="ghost" />

<ButtonGroup aria-label="Alignment">
  <Button variant="outline">Left</Button>
  <Button variant="outline">Centre</Button>
</ButtonGroup>
```

Variants: `primary` `secondary` `outline` `ghost` `danger` · Sizes: `sm` `md` `lg`

`IconButton` requires `aria-label` — TypeScript will not let you omit it.

### Forms

```tsx
<FormField label="Email" description="We use this to sign you in." error={error} required>
  <Input type="email" placeholder="you@example.com" />
</FormField>

<Input size="lg" prefix="₱" suffix=".00" invalid />
<Textarea autoSize placeholder="Write a note…" />
<FormMessage tone="error">This field is required.</FormMessage>
```

`FormField` generates the `id`, links the `<label>`, wires `aria-describedby` and sets `aria-invalid`. Just wrap your control in it.

### Cards and badges

```tsx
<Card variant="elevated">
  <CardHeader>
    <Heading level={3} size="md">Monthly report</Heading>
  </CardHeader>
  <CardBody>…</CardBody>
  <CardFooter divided>
    <Button size="sm">Download</Button>
  </CardFooter>
</Card>

<Badge tone="success" dot>Active</Badge>
<Badge tone="danger" variant="solid" srLabel="Status:">Overdue</Badge>
```

Card variants: `outlined` `elevated` `filled`
Badge tones: `neutral` `primary` `accent` `success` `warning` `danger` `info`

Use `srLabel` when the colour is what carries the meaning — screen readers cannot see it.

### Feedback

```tsx
<Alert tone="danger" title="Payment failed">
  Update your card details to continue.
</Alert>

<Alert tone="info" title="Tip" onDismiss={() => setShown(false)}>
  You can dismiss this.
</Alert>

<Spinner size="lg" />
```

Tone picks the ARIA role for you: `danger`/`warning` interrupt, `info`/`success` wait for a pause.

### Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="danger">Delete project</Button>
  </DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Delete this project?</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="danger">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Focus trapping, Escape and focus restoration are handled.

### Dropdown menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Manage</DropdownMenuLabel>
    <DropdownMenuItem>
      Edit <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem disabled>Archive</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs

```tsx
<Tabs defaultValue="overview" variant="line">
  <TabsList aria-label="Sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsPanel value="overview">…</TabsPanel>
  <TabsPanel value="activity">…</TabsPanel>
</Tabs>
```

### Toast

Mount the provider once, then call `toast()` from anywhere below it.

```tsx
// app/providers.tsx
"use client";
import { ToastProvider } from "@abbainitiative/ui";

export function Providers({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
```

```tsx
"use client";
import { useToast } from "@abbainitiative/ui";

function SaveButton() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({ title: "Saved", tone: "success" })}>Save</Button>
  );
}
```

---

## Dark mode

Set `data-theme="dark"` (or the class `dark`) on `<html>`. Both work.

```tsx
document.documentElement.setAttribute("data-theme", "dark");
```

To avoid a flash of the wrong theme, set it in a blocking script before React hydrates — [full example in the docs](https://abba-ui.vercel.app/docs/dark-mode). `next-themes` works with no changes.

## Theming

Every colour, size and radius is a CSS variable. Override the ones you want, after the ABBA stylesheet:

```css
:root {
  --abba-primary: #4338ca;
  --abba-primary-hover: #3730a3;
  --abba-radius-md: 3px;
  --abba-font-sans: var(--my-font), system-ui, sans-serif;
}
```

No provider, no rebuild, and it works inside Server Components. [Full token list →](https://abba-ui.vercel.app/docs/tokens)

## Next.js notes

- **Do not add it to `transpilePackages`.** The package already ships compiled with `"use client"` in the right places.
- These render in a Server Component with no boundary of your own: `Box` `Stack` `Inline` `Container` `Grid` `Separator` `VisuallyHidden` `Text` `Heading` `Label` `Code` `Link` `ButtonGroup` `FormMessage` `Card` `Badge` `Spinner`
- These carry their own `"use client"`: `Button` `IconButton` `Input` `Textarea` `FormField` `Alert` `Dialog` `DropdownMenu` `Tabs` `Toast`
- You can render either kind from the server. You just cannot pass a **function** to one — move that into a small `"use client"` component.

## Smaller imports

Every component also has its own entry point, if you prefer the narrower import:

```tsx
import { Badge } from "@abbainitiative/ui/badge";
```

## Requirements

React 18.2 or 19. Your `tsconfig.json` needs `"moduleResolution": "bundler"` (or `node16`/`nodenext`).

---

## Working on this repo

```bash
pnpm install
pnpm build     # build the library first
pnpm dev       # library watch + docs site on :3000
pnpm preflight # everything CI runs
```

| Path                       |                             |
| -------------------------- | --------------------------- |
| `packages/ui`              | the published library       |
| `apps/docs`                | the documentation site      |
| `scripts/test-package.mjs` | verifies the packed tarball |

See [CONTRIBUTING.md](./CONTRIBUTING.md) to add a component.

MIT © ABBA Initiative
