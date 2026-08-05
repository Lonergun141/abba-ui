# @abbainitiative/ui

React components for Next.js and plain React. No Tailwind, no provider, no config.

**[Live docs →](https://abba-ui.vercel.app)** · [GitHub](https://github.com/Lonergun141/abba-ui)

---

## Install

```bash
pnpm add @abbainitiative/ui
```

React 18.2 or 19 is a peer dependency.

## Use it

**1. Import the stylesheet once**, at the root of your app:

```tsx
// app/layout.tsx (Next.js) or src/main.tsx (Vite)
import "@abbainitiative/ui/styles.css";
```

Put it above your own stylesheets so your overrides win.

**2. Use the components:**

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

No `transpilePackages`, no PostCSS plugin, no theme provider.

## What's in it

|                |                                                                        |
| -------------- | ---------------------------------------------------------------------- |
| **Layout**     | `Box` `Stack` `Inline` `Container` `Grid` `Separator` `VisuallyHidden` |
| **Typography** | `Text` `Heading` `Label` `Code` `Link`                                 |
| **Buttons**    | `Button` `IconButton` `ButtonGroup`                                    |
| **Forms**      | `Input` `Textarea` `FormField` `FormMessage`                           |
| **Display**    | `Card` `Badge`                                                         |
| **Feedback**   | `Alert` `Spinner`                                                      |
| **Overlays**   | `Dialog` `DropdownMenu` `Tabs` `Toast`                                 |

Every component also has its own entry point: `@abbainitiative/ui/badge`.

## Quick examples

```tsx
<Button variant="danger" loading>Deleting</Button>
<Button asChild><Link href="/signup">Sign up</Link></Button>
<IconButton aria-label="Delete" icon={<TrashIcon />} />

<FormField label="Email" error={error} required>
  <Input type="email" />
</FormField>

<Alert tone="danger" title="Payment failed">Update your card details.</Alert>
<Badge tone="success" dot>Active</Badge>
```

[Every component, with live examples →](https://abba-ui.vercel.app/docs/components)

## Dark mode

Set `data-theme="dark"` or the class `dark` on `<html>`. Both selectors ship, so `next-themes` works unchanged.

## Theming

Every colour, size and radius is a CSS variable. Override what you want, after the ABBA stylesheet:

```css
:root {
  --abba-primary: #4338ca;
  --abba-radius-md: 3px;
  --abba-font-sans: var(--my-font), system-ui, sans-serif;
}
```

No provider and no runtime, so it works inside Server Components too. [Token list →](https://abba-ui.vercel.app/docs/tokens)

## Next.js

`"use client"` is placed per component, never at the package root — so importing a `Stack` does not drag the whole library into your client bundle.

**Server-renderable:** `Box` `Stack` `Inline` `Container` `Grid` `Separator` `VisuallyHidden` `Text` `Heading` `Label` `Code` `Link` `ButtonGroup` `FormMessage` `Card` `Badge` `Spinner`

**Bring their own client boundary:** `Button` `IconButton` `Input` `Textarea` `FormField` `Alert` `Dialog` `DropdownMenu` `Tabs` `Toast`

You can render either kind from a Server Component — you just cannot pass a function to one. [Next.js guide →](https://abba-ui.vercel.app/docs/nextjs)

## Accessibility

Keyboard interaction, focus management and ARIA relationships ship with each component and are tested, including an automated axe pass in CI. Focus trapping and menu navigation come from [Radix](https://www.radix-ui.com/primitives), used internally — none of its API is exposed.

## Requirements

- React 18.2 or 19
- `"moduleResolution": "bundler"`, `node16` or `nodenext` in your `tsconfig.json`
- Evergreen Chrome, Edge, Firefox, Safari

MIT © ABBA Initiative
