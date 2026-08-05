# Contributing to ABBA UI

Thanks for helping. This document covers the parts that are specific to this repository — the rest is ordinary GitHub flow.

## Getting set up

```bash
pnpm install
pnpm build      # packages/ui must exist as dist before apps/docs can resolve it
pnpm dev
```

`pnpm dev` runs the library in watch mode and the docs site on `http://localhost:3000`.

Before opening a pull request:

```bash
pnpm preflight
```

That runs lint, typecheck, tests, the full build, and the packed-tarball verification — the same gates CI applies.

## Adding a component

A component is not finished until all of these are true.

### 1. File layout

```
packages/ui/src/components/<name>/
  <name>.tsx          the component
  <name>.module.css   its styles
  <name>.test.tsx     its tests
  index.ts            re-exports the component and its types
```

### 2. Wire up the entry points

- Export the component and its prop types from `packages/ui/src/index.ts`.
- Add a `./<name>` entry to `exports` in `packages/ui/package.json`, pointing at
  `./dist/components/<name>/index.js` and `./dist/components/<name>/index.d.ts`.

`src/test/exports.test.ts` fails if a component directory has no matching `exports` entry, so this is enforced rather than remembered. The Vite config discovers component directories from the filesystem, so no build change is needed.

### 3. Decide the client boundary honestly

Add `"use client"` **only** if the component uses state, effects, refs into browser APIs, event handlers, or context. Never add it to `src/index.ts`.

If it is not needed, leaving it out is not an optimisation — it is the difference between a consumer's page staying on the server and their whole layout crossing into the client.

`pnpm test:package` asserts the directive placement of every component against the packed tarball. Add your component to the appropriate list in `scripts/test-package.mjs`.

### 4. Style with tokens only

Every value comes from a `--abba-` custom property. If you find yourself writing a literal colour, spacing value or radius, the system is missing a token — add one to `src/styles/tokens.css`, for both the light and dark sets.

Class names are content-hashed and are **not** public API. Consumers style through tokens or the `className` prop.

### 5. Forward what consumers need

- `React.forwardRef` to the underlying element, with the correct element type.
- Spread the remaining props onto that element.
- Merge `className` **after** the component's own classes, so a consumer's class wins on source order without `!important`.
- Set `displayName`.

### 6. Meet the accessibility bar

- Semantic HTML underneath; ARIA only for what HTML cannot express.
- Keyboard operable, with the interaction pattern the role implies.
- A visible `:focus-visible` ring — never removed.
- Decorative icons are `aria-hidden`.
- Where colour carries meaning, provide a text alternative.
- Token pairings clear WCAG AA (4.5:1 text, 3:1 large text and state borders).
- Transitions collapse under `prefers-reduced-motion`. Where motion carries meaning, degrade to a static state rather than hiding.

For behaviour that is genuinely difficult — focus trapping, roving tabindex, type-ahead, collision-aware positioning — use the Radix primitive rather than hand-rolling it, and keep its API out of ABBA's props.

### 7. Test it

Every component needs tests for:

- Rendering and each variant, tone and size.
- Ref forwarding and `className` merging.
- Keyboard interaction, written behaviourally — assert what a user can do, not which element holds `tabindex`.
- ARIA relationships that the component creates.
- An axe pass: `await expect(container).toHaveNoAxeViolations()`.

The `color-contrast` axe rule is disabled because jsdom performs no layout or paint; contrast is verified against the token values instead.

### 8. Document it

Add a `ComponentDoc` entry to the matching file in `apps/docs/content/registry/`, including at least one example. Add the rendered demo to `apps/docs/components/demos/static-demos.tsx`, or to `interactive-demos.tsx` if it genuinely needs state or a hook.

### 9. Add a changeset

```bash
pnpm changeset
```

A new component is a **minor** bump. See [`.changeset/README.md`](./.changeset/README.md) for the rest.

## Code standards

- **Strict TypeScript.** No `any` without a comment explaining why the type system leaves no alternative.
- **Never suppress an error to make a build pass.** No `@ts-ignore`, no `eslint-disable` without a stated reason, no `ignoreBuildErrors`. If a check is wrong, change the check deliberately and say why.
- **Comment the non-obvious.** Explain why a decision was made, not what the line does. If a workaround exists for a specific bug or limitation, name it.

## Reporting bugs

Include the component, the version, your framework and its version, and a minimal reproduction. For accessibility bugs, include the assistive technology and browser — those are treated as correctness bugs, not enhancements.

## Releases

Maintainers do not publish by hand. Merging to `main` triggers the release workflow, which opens a release pull request accumulating pending changesets; merging that pull request versions the package, writes the changelog, and publishes to npm with provenance.

The `NPM_TOKEN` secret lives in the repository's Actions secrets. It is never committed, never printed, and never added to any `.npmrc` in the repository.
