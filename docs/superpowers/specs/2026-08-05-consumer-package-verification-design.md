# Published Package Consumer Verification Design

**Goal:** Prove that a clean Next.js App Router application can install and use the published `@abbainitiative/ui@0.1.0` package, including components, CSS, theme overrides, and design tokens.

## Verification app

Create a disposable sibling application at `C:\dev\abba-ui-consumer-e2e`, outside the ABBA UI repository. The app will import the package from the public npm registry, not from a workspace link or local path.

The page will render representative public APIs: `Container`, `Stack`, `Heading`, `Text`, `Button`, `Card`, `Badge`, `Input`, and `Alert`. It will import `@abbainitiative/ui/styles.css`, apply application-level overrides to `--abba-primary` and `--abba-surface`, and expose a light/dark theme toggle so computed styles can be checked.

## E2E verification

Playwright will run against a local Next.js server and verify:

- the package components render in a clean consumer project;
- the published stylesheet defines ABBA custom properties;
- an application override changes a component's computed color;
- the theme toggle changes the document theme and surface styling;
- the button interaction updates visible application state.

The app will also run a production build before E2E. Browser inspection will be performed against the same local page after automated tests pass.

## Scope

This harness is intentionally outside the ABBA UI repository and is not coupled to its workspace packages. The ABBA UI repository's existing registry/MCP/docs changes will be committed and pushed separately after verification, then redeployed to the linked Vercel project.
