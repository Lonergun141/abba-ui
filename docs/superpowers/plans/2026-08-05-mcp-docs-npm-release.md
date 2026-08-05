# Public MCP Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Publish the registry and MCP packages to npm and expose the MCP setup through the ABBA UI landing page and documentation site.

**Architecture:** Keep `@abbainitiative/registry` as the machine-readable catalogue dependency of `@abbainitiative/mcp`. Add a server-rendered `/docs/mcp` guide and a focused landing-page callout that link to the public `npx` setup.

**Tech Stack:** pnpm workspaces, npm registry, Next.js App Router, ABBA UI components, Turborepo, Vitest, Vercel.

---

### Task 1: Add the MCP documentation page and navigation

**Files:**

- Create: `apps/docs/app/docs/mcp/page.tsx`
- Modify: `apps/docs/content/navigation.ts`

- [ ] **Step 1: Add the `/docs/mcp` guide**

Render the MCP purpose, read-only behavior, supported tools, the public `npx -y @abbainitiative/mcp` command, Claude/Codex/generic JSON configuration examples, and a link back to component installation.

- [ ] **Step 2: Add MCP to Getting started navigation**

Insert `{ title: "MCP", href: "/docs/mcp" }` after the React item so it appears in the guide sidebar and adjacent-page navigation.

### Task 2: Add the landing-page MCP callout

**Files:**

- Modify: `apps/docs/app/page.tsx`
- Modify: `apps/docs/components/landing/landing.module.css` only if the existing section styles cannot express the callout without duplication.

- [ ] **Step 1: Add an MCP section near the final CTA**

Use existing ABBA UI components and landing styles to explain that coding agents can query real component props and tokens through MCP, with a button linking to `/docs/mcp`.

- [ ] **Step 2: Confirm the page remains a server component**

Keep the callout declarative and avoid adding client state or browser-only APIs to `apps/docs/app/page.tsx`.

### Task 3: Make the package publication order safe

**Files:**

- Modify: `packages/mcp/README.md` only if the published setup text needs correction.
- Inspect: `packages/registry/package.json`, `packages/mcp/package.json`, `scripts/test-package.mjs`.

- [ ] **Step 1: Build and inspect both packed manifests**

Run:

```powershell
pnpm --filter @abbainitiative/registry build
pnpm --filter @abbainitiative/mcp build
pnpm --filter @abbainitiative/registry pack --pack-destination .\artifacts
pnpm --filter @abbainitiative/mcp pack --pack-destination .\artifacts
```

Confirm the MCP tarball references `@abbainitiative/registry` with a concrete version, not `workspace:*`. If it does not, use `pnpm publish --dry-run` to validate pnpm's workspace rewrite before publishing.

- [ ] **Step 2: Publish the registry package**

From `packages/registry`, run `pnpm publish --access public` and complete npm's browser security-key authentication if prompted.

- [ ] **Step 3: Publish the MCP package**

From `packages/mcp`, run `pnpm publish --access public` and complete npm authentication if prompted.

### Task 4: Verify clean consumers and the site

- [ ] **Step 1: Verify npm metadata and clean MCP execution**

Run `npm view` for both packages, then in a temporary directory run `npx -y @abbainitiative/mcp@0.1.0` with an initialize/tools-list JSON-RPC handshake. Confirm the seven expected tools are returned.

- [ ] **Step 2: Run repository verification**

Run:

```powershell
pnpm preflight
```

Expected: formatting, lint, typecheck, tests, builds, and package checks pass.

- [ ] **Step 3: Deploy and verify Vercel**

Run `pnpm dlx vercel --prod` from the repository root. Verify `/`, `/docs/mcp`, `/docs/installation`, and `/docs/tokens` return HTTP 200 and contain the expected MCP/package text.

### Task 5: Commit and push

- [ ] **Step 1: Review the diff and commit the approved files**

Use the existing feature branch and commit the docs, package, plan/spec, and release-related changes with a focused message.

- [ ] **Step 2: Push and update the existing draft PR**

Push the branch and confirm the draft PR contains the MCP docs and npm publication work.
