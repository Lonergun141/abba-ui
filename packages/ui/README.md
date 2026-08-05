# @abbainitiative/ui

**ABBA UI** — the component library of the ABBA Design System.

Accessible, themeable React components for Next.js App Router applications and plain React alike. No Tailwind required, no provider to mount, no build-step coupling.

📖 **[ui.abbainitiative.ph](https://ui.abbainitiative.ph)** — full documentation with live examples.

---

## Installation

```bash
pnpm add @abbainitiative/ui
# npm install @abbainitiative/ui
# yarn add @abbainitiative/ui
# bun add @abbainitiative/ui
```

`react` and `react-dom` are peer dependencies (React 18.2 or 19).

## Usage

Import the stylesheet once, as high in the tree as you can:

```tsx
// app/layout.tsx
import "@abbainitiative/ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Then use components anywhere — including inside Server Components:

```tsx
// app/page.tsx — no "use client" needed
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

## What makes it different

### `"use client"` lives on the component, never the package root

Most component libraries put the directive at the top of their barrel file, which makes every component a Client Component — including a `Stack` that only sets `display: flex`. Here each component file carries its own directive, so a page importing `Heading` and `Stack` stays entirely on the server.

**Server-renderable:** `Box` `Stack` `Inline` `Container` `Grid` `Separator` `VisuallyHidden` `Text` `Heading` `Label` `Code` `Link` `ButtonGroup` `FormMessage` `Card` `Badge` `Spinner`

**Bring their own client boundary:** `Button` `IconButton` `Input` `Textarea` `FormField` `Alert` `Dialog` `DropdownMenu` `Tabs` `Toast`

You can render either kind from a Server Component. The only restriction is the framework's: you cannot pass a function to a Client Component.

### One stylesheet, built on CSS custom properties

Styles compile to a single CSS file. There is no Tailwind requirement, no PostCSS plugin, and no content-scanning config to keep in sync with your source layout. Theming is a stylesheet change:

```css
:root {
  --abba-primary: #4338ca;
  --abba-primary-hover: #3730a3;
  --abba-radius-md: 3px;
}
```

Because it is only CSS, theming works unchanged inside Server Components.

### Dark mode under both conventions

The dark token set ships under `[data-theme="dark"]` **and** `.dark`, so it drops into either convention — including alongside `next-themes` or Tailwind's dark variant.

### Tree-shakeable

Per-component chunks with an explicit `exports` map, and `"sideEffects": ["**/*.css"]`. Import from the root or from a subpath:

```tsx
import { Badge } from "@abbainitiative/ui";
import { Badge } from "@abbainitiative/ui/badge";
```

### Accessible by construction

Focus management, ARIA relationships and keyboard interaction are part of each component. Every component has unit tests for its keyboard behaviour and an automated axe pass, both of which run in CI.

Behaviour that is genuinely hard to implement correctly — focus trapping, roving tabindex, type-ahead, collision-aware positioning — is delegated to [Radix](https://www.radix-ui.com/primitives) primitives, used as an invisible behaviour layer. None of Radix's API surfaces in ABBA's props.

## Components

| Category     | Components                                                             |
| ------------ | ---------------------------------------------------------------------- |
| Layout       | `Box` `Stack` `Inline` `Container` `Grid` `Separator` `VisuallyHidden` |
| Typography   | `Text` `Heading` `Label` `Code` `Link`                                 |
| Actions      | `Button` `IconButton` `ButtonGroup`                                    |
| Forms        | `Input` `Textarea` `FormField` `FormMessage`                           |
| Data display | `Card` `Badge`                                                         |
| Feedback     | `Alert` `Spinner`                                                      |
| Overlays     | `Dialog` `DropdownMenu` `Tabs` `Toast`                                 |

## Requirements

- React 18.2 or 19
- A bundler that reads the `exports` field — Next.js, Vite, Rspack, Parcel, webpack 5
- `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"` in your `tsconfig.json`. The legacy `"node"` resolution ignores `exports` and cannot find the subpaths.

Browser support is evergreen Chrome, Edge, Firefox and Safari. The stylesheet uses custom properties, logical properties and `color-mix()`.

## Documentation

- [Introduction](https://ui.abbainitiative.ph/docs)
- [Installation](https://ui.abbainitiative.ph/docs/installation)
- [Next.js guide](https://ui.abbainitiative.ph/docs/nextjs)
- [Design tokens](https://ui.abbainitiative.ph/docs/tokens)
- [Theming](https://ui.abbainitiative.ph/docs/theming)
- [Dark mode](https://ui.abbainitiative.ph/docs/dark-mode)
- [Accessibility](https://ui.abbainitiative.ph/docs/accessibility)

## Versioning

Semantic versioning. While the major version is `0`, minor releases may contain breaking changes, each documented in [CHANGELOG.md](./CHANGELOG.md).

Class names are **not** part of the public API — they are content-hashed and change between builds. Token names **are**: removing or renaming one is a breaking change.

## Licence

MIT © ABBA Initiative
