# ABBA UI — Design Specification

**Date:** 2026-08-04
**Status:** Approved
**Public name:** ABBA UI · **Formal name:** ABBA Design System
**npm package:** `@abbainitiative/ui` · **Repo:** `Lonergun141/abba-ui` · **Docs:** ui.abbainitiative.ph

## 1. Purpose

A reusable React component library, publishable to npm, consumable by any React or
Next.js App Router application without requiring Tailwind CSS, PostCSS, or any
library-specific build plugin in the consuming app.

Success means a developer can run `npm install @abbainitiative/ui`, add one CSS
import, and use accessible, themeable components in both Server and Client
Components.

## 2. Repository

`C:\dev\abba-ui` — deliberately outside OneDrive. pnpm relies on symlinks and
hardlinks, and `node_modules` holds tens of thousands of files; OneDrive sync
corrupts symlinks and makes installs pathologically slow. GitHub is the backup.

pnpm workspaces + Turborepo, with `apps/docs`, `packages/ui`,
`packages/eslint-config`, `packages/typescript-config`, and `examples/nextjs-app`.

## 3. Toolchain decisions

Versions were resolved from the npm registry at design time, not assumed.

| Tool | Version | Note |
| --- | --- | --- |
| Next.js | 16.3.0 | docs + example app |
| React | 19.2.8 | peer range allows >= 18.2 |
| Vite | 8.2.0 | library build |
| **TypeScript** | **6.0.3** | see below |
| Vitest | 4.1.10 | unit + a11y |
| Playwright | 1.62.1 | E2E against docs |
| Turborepo | 2.10.8 | task orchestration |
| ESLint | 10.8.0 | flat config |
| Radix UI | 1.x / 2.x | behavior layer only |

### 3.1 Why TypeScript 6.0.3 and not 7.0.2

TypeScript 7.0.2 holds the `latest` dist-tag. It was rejected after empirical
testing, not on suspicion.

Probe results:

- `tsc 7.0.2 --emitDeclarationOnly` **works** (exit 0) once `rootDir` is set
  explicitly. TS 7 raises `TS5011` where TS 5 silently inferred the root.
- `typescript-eslint` 8.66.0 **throws at import time** under TS 7.0:
  `"typescript-eslint does not support TS 7.0."` This kills even untyped linting,
  because the failure is in module initialisation, not in a rule.
- Under TypeScript **6.0.3**, both `tsc --emitDeclarationOnly` and type-aware
  ESLint exit 0.

TypeScript 6.0.3 is a stable release (`6.0.2`, `6.0.3` are plain semver; only the
`latest` tag has moved on to 7.x). Adopting 7.x would require either disabling
lint or suppressing errors, both explicitly forbidden by the brief.

**Upgrade trigger:** typescript-eslint issue #10940 tracks TS >= 7.1 support.
Revisit when that lands.

### 3.2 Rejected: Base UI

`@base-ui-components/react` is at `1.0.0-rc.0`. A release candidate is not a
stable dependency for a package other people install. Radix UI is stable, ships
per-component packages that keep tree-shaking honest, and has the most
battle-tested focus trapping and typeahead available.

Radix is an **invisible behavior layer**. The public API, prop names, class
names, tokens, styling, and documentation belong to ABBA UI.

### 3.3 Rejected: Tailwind CSS in the docs site

The brief permits Tailwind inside `apps/docs`. Declined: building the docs with
ABBA's own tokens and CSS Modules dogfoods the library, drops the
`@tailwindcss/oxide` native binary from the dependency graph, and turns the docs
site into a second real-world proof that the published package works under the
App Router.

## 4. Library build architecture

**Vite 8 library mode with `preserveModules: true`.** One output chunk per source
module. This buys three things simultaneously:

1. `"use client"` stays attached to only the modules that declared it.
2. Tree-shaking works at component granularity.
3. The per-component export map (`@abbainitiative/ui/button`) maps to real files
   rather than arbitrary bundle slices.

**Declarations come from `tsc --emitDeclarationOnly`, not `vite-plugin-dts`.**
Plugins that consume the TypeScript compiler API are the most fragile link during
a major TypeScript transition. Driving `tsc` directly means declarations are
emitted by the same compiler that typechecks.

**Directive preservation.** Rollup strips module-level directives and emits a
`MODULE_LEVEL_DIRECTIVE` warning. A local plugin records which modules declared
`"use client"` during a `enforce: "pre"` transform, then re-prepends the directive
in `renderChunk` using MagicString so source maps stay accurate. The
`MODULE_LEVEL_DIRECTIVE` warning is suppressed by code, specifically — warnings
are not blanket-silenced.

**Externals.** `react`, `react-dom`, `react/jsx-runtime`, and all `@radix-ui/*`
packages are external. Radix ships its own client boundaries; bundling it would
duplicate React context and break those boundaries.

**CSS.** CSS Modules compile into a single `dist/styles.css` via
`build.lib.cssFileName`. `sideEffects: ["**/*.css"]` so bundlers never drop it.

### 4.1 Client/server boundary policy

`"use client"` is never placed at the package root.

| Server-renderable (no directive) | Client (`"use client"`) |
| --- | --- |
| Box, Stack, Inline, Container, Grid | Button, IconButton |
| Separator, VisuallyHidden | Input, Textarea, FormField, FormMessage |
| Text, Heading, Label, Code, Link | Dialog, DropdownMenu, Tabs, Toast |
| Card, Badge, Spinner, ButtonGroup | Alert (only when dismissible) |

The example app proves this by rendering the left column from a Server Component
file containing no `"use client"` directive.

## 5. Design system — "Cedar & Ember"

Token prefix is `--abba-`, **not** `--ui-`. `--ui-primary` is a collision magnet:
any other library or application using the same obvious prefix silently fights
ABBA's values. This is a deliberate deviation from the brief's illustrative
examples, approved during brainstorming.

Deep cedar teal primary, warm ember accent, over a warm-tinted neutral ramp
(hue ~40 rather than pure grey). The warm cast is the single most effective
defence against a system reading as templated.

```css
--abba-primary: #1F6B60;        /* 5.8:1 against white text */
--abba-primary-hover: #155349;
--abba-accent: #B7621A;
--abba-success: #1F7A4D;  --abba-warning: #B7791F;
--abba-danger:  #B42318;  --abba-info:    #2C6BA8;
--abba-radius-md: 10px;
```

Token families: brand, neutral, semantic state, background/foreground, border,
font family, size, weight, line height, spacing, radii, shadow, z-index, motion
duration and easing, focus ring, disabled opacity.

Dark mode ships **both** `[data-theme="dark"]` and `.dark` selectors so it drops
into either convention. All animation is wrapped in
`@media (prefers-reduced-motion: reduce)` guards.

No font is downloaded by the library — the docs site loads Inter, the package
falls back to the system stack.

## 6. Component scope

Foundations: Box, Stack, Inline, Container, Grid, Separator, VisuallyHidden.
Typography: Text, Heading, Label, Code, Link.
Actions: Button, IconButton, ButtonGroup.
Forms: Input, Textarea, FormField, FormMessage.
Data display: Card, Badge.
Feedback: Alert, Spinner.
Overlays: Dialog, DropdownMenu, Tabs, Toast.

Remaining catalogue components (Table, Select, Avatar, Progress, Stat, Popover,
Sheet, AlertDialog, EmptyState, Skeleton, Tooltip, Checkbox, RadioGroup, Switch,
NativeSelect, SearchInput) are deferred until the architecture and test suite are
stable, per the phasing in the brief.

Every component ships: TypeScript props, forwarded ref where meaningful, ARIA and
keyboard behavior, disabled and focus-visible states, size and visual variants,
`className` merging, native HTML attribute passthrough, a display name, unit
tests, and a documentation page.

## 7. Testing

- **Unit** — Vitest 4 + React Testing Library + jsdom. Rendering, variants, sizes,
  disabled, loading, ref forwarding, keyboard, controlled and uncontrolled,
  ARIA attributes, custom class names, native prop passthrough.
- **Accessibility** — `axe-core` 4.12 driven by a small local matcher rather than
  `vitest-axe` (pinned at 0.1.0). The brief bans unmaintained dependencies; owning
  fifteen lines beats inheriting an abandoned one.
- **Export contract** — a test asserts every component directory has a matching
  `exports` entry in `package.json`, so a missing export fails the build.
- **E2E** — Playwright against the docs site: navigation, theme switch, mobile
  nav, copy-code, Dialog, DropdownMenu, Toast, plus assertions of zero console
  errors and zero hydration errors.
- **Package** — `pnpm test:package` builds, runs `npm pack`, installs the `.tgz`
  into a **clean temporary copy** of the example app (never the workspace-linked
  one, rewriting the `workspace:*` protocol out of the copied manifest), runs
  `next build`, and asserts a single React instance, emitted CSS, and resolving
  types.

## 8. Out of scope for this build

Two steps require credentials that only the repository owner holds:

- **`npm publish`** — needs npm login and an OTP. Everything up to and including
  `npm pack --dry-run` is verified; the publish command is documented.
- **Vercel project creation and `ui.abbainitiative.ph` DNS** — needs the Vercel
  account. Build configuration, ignored-build-step, and workflows are committed;
  project linking is documented.

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| Vite `preserveModules` + CSS extraction interaction is unverified | Verified against a real build before components are written; fallback is a dedicated CSS build step |
| TypeScript 6 → 7 migration pressure | Pinned with a documented upgrade trigger |
| Radix major-version churn | Externalised and range-pinned; behavior layer is swappable because the public API is ours |
| Windows path handling in the package test script | Script uses `node:path` throughout and is exercised in CI on ubuntu |
