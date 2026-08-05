<div align="center">

# ABBA UI

**The component library of the ABBA Design System.**

Accessible, themeable React components for Next.js App Router applications and plain React alike.
No Tailwind required, no provider to mount, no build-step coupling.

[**Documentation**](https://ui.abbainitiative.ph) · [**npm**](https://www.npmjs.com/package/@abbainitiative/ui) · [MIT licensed](./LICENSE)

</div>

---

```bash
pnpm add @abbainitiative/ui
```

```tsx
// app/layout.tsx
import "@abbainitiative/ui/styles.css";

// app/page.tsx — a Server Component, no "use client" needed
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

## What this repository contains

| Path                                                     | What it is                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`packages/ui`](./packages/ui)                           | `@abbainitiative/ui` — the published component library                         |
| [`apps/docs`](./apps/docs)                               | The documentation site at [ui.abbainitiative.ph](https://ui.abbainitiative.ph) |
| `packages/eslint-config`                                 | Shared flat ESLint configuration                                               |
| `packages/typescript-config`                             | Shared `tsconfig` bases                                                        |
| [`scripts/test-package.mjs`](./scripts/test-package.mjs) | Verifies the packed tarball as a consumer receives it                          |
| [`docs/`](./docs)                                        | Design decisions and specifications                                            |

## The decisions worth knowing about

### `"use client"` is placed per component, never at the package root

A library that puts the directive at the top of its barrel makes every component a Client Component — including a `Stack` that only sets `display: flex`. Importing one button then drags the whole library across the boundary.

Here each component file carries its own directive, and the build preserves it per chunk. A page importing `Heading` and `Stack` stays entirely on the server; a page importing `Button` ships only the button.

This is the property most likely to regress silently, so it is asserted directly against the packed tarball in `pnpm test:package`.

### Styles are one compiled stylesheet on CSS custom properties

No Tailwind requirement, no PostCSS plugin to register, no content-scanning configuration to keep in sync with your source layout. Theming is a stylesheet override, which means it also works inside Server Components.

### Radix is an invisible behaviour layer

Focus trapping, roving tabindex, type-ahead and collision-aware positioning are delegated to Radix primitives. None of Radix's API surfaces in ABBA's props, so the dependency can be revisited without a breaking change for consumers.

### The docs site consumes the built package

`apps/docs` deliberately omits `transpilePackages`. It resolves `@abbainitiative/ui` to the compiled `dist`, exactly as an npm consumer does — so a regression in the published artefact fails the docs build rather than reaching a release.

## Working on it

### Requirements

- Node 20.11 or newer (CI runs the version in [`.nvmrc`](./.nvmrc))
- pnpm 11 — `corepack enable` or `npm install -g pnpm`

### Setup

```bash
pnpm install
pnpm build      # packages/ui must be built before the docs site can resolve it
pnpm dev        # library in watch mode + docs site on :3000
```

### Scripts

| Command              | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `pnpm dev`           | Library watch build and the docs site together       |
| `pnpm build`         | Build every package in dependency order              |
| `pnpm lint`          | ESLint across the workspace                          |
| `pnpm typecheck`     | `tsc --noEmit` across the workspace                  |
| `pnpm test`          | Vitest unit, interaction and axe suites              |
| `pnpm test:coverage` | The same suites with a V8 coverage report            |
| `pnpm test:package`  | Pack the tarball and verify what a consumer receives |
| `pnpm format`        | Prettier, writing in place                           |
| `pnpm changeset`     | Record a change for the next release                 |
| `pnpm preflight`     | Everything CI runs, in one command                   |

Run `pnpm preflight` before opening a pull request.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the component checklist, the accessibility bar, and how releases are made.

## Licence

MIT © ABBA Initiative
