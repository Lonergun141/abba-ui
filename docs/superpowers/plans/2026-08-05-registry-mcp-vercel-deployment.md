# Registry and MCP Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Finish the in-progress registry/MCP extraction, verify the docs app consumes the built workspace packages, and deploy the result to the linked `abba-ui` Vercel project.

**Architecture:** `packages/registry` owns the typed component and token catalogue; `packages/mcp` exposes that catalogue through read-only MCP tools; `apps/docs` imports the registry package instead of maintaining a second copy. Turborepo builds workspace dependencies before the Next.js docs app, and `apps/docs/vercel.json` supplies the monorepo install/build commands to Vercel.

**Tech Stack:** pnpm 11 workspaces, Turborepo, TypeScript 6, Vitest, Next.js 16, Vercel CLI.

---

### Task 1: Verify the current workspace migration

**Files:**

- Inspect only: `packages/registry`, `packages/mcp`, `apps/docs`, `pnpm-lock.yaml`, `apps/docs/vercel.json`
- Test: existing `packages/registry/src/tokens.test.ts` and `packages/mcp/src/server.test.ts`

- [ ] **Step 1: Run the focused registry and MCP tests**

Run:

```powershell
pnpm --filter @abbainitiative/registry test
pnpm --filter @abbainitiative/mcp test
```

Expected: both Vitest commands exit 0; registry tests confirm the catalogue matches `packages/ui/src/styles/tokens.css`; MCP tests exercise the real in-memory JSON-RPC transport.

- [ ] **Step 2: Run package typechecks and builds**

Run:

```powershell
pnpm --filter @abbainitiative/registry typecheck
pnpm --filter @abbainitiative/mcp typecheck
pnpm --filter @abbainitiative/registry build
pnpm --filter @abbainitiative/mcp build
```

Expected: all commands exit 0 and produce `packages/registry/dist` and `packages/mcp/dist` without test files.

- [ ] **Step 3: If a check exposes a migration bug, add a focused regression test first**

For each failure, add the smallest test beside the failing package that demonstrates the intended public behavior, run that test and confirm it fails for the expected reason, then patch the implementation and rerun it to green. Do not change production code to make an unverified test pass.

### Task 2: Verify the docs app consumes package artefacts

**Files:**

- Inspect/modify only as required: `apps/docs/app`, `apps/docs/components/docs/props-table.tsx`, `apps/docs/content/navigation.ts`, `apps/docs/app/docs/tokens/page.tsx`, `apps/docs/package.json`

- [ ] **Step 1: Run docs lint and typecheck**

Run:

```powershell
pnpm --filter @abbainitiative/docs lint
pnpm --filter @abbainitiative/docs typecheck
```

Expected: no lint errors and no TypeScript errors, including resolution of `@abbainitiative/registry` from its built `dist` entrypoint.

- [ ] **Step 2: Build the docs app through Turborepo**

Run:

```powershell
pnpm turbo build --filter=@abbainitiative/docs
```

Expected: registry and UI build first, then Next.js generates `apps/docs/.next` successfully with no `transpilePackages` requirement.

- [ ] **Step 3: Fix only test-proven issues**

If the docs build fails, add or update a focused regression test where the failure belongs, then make the smallest typed change. Preserve the package-boundary rule: no raw copy of registry data should be reintroduced into `apps/docs`.

### Task 3: Run the repository release-quality verification

**Files:**

- Inspect only: root scripts in `package.json`, CI workflow `.github/workflows/release.yml`, generated build output

- [ ] **Step 1: Run the complete preflight**

Run:

```powershell
pnpm preflight
```

Expected: format check, lint, typecheck, tests, all builds, and `pnpm test:package` exit 0.

- [ ] **Step 2: Review the final diff and status**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only the approved registry/MCP/docs/CI changes and the implementation plan are present. Do not stage or remove unrelated user changes.

### Task 4: Deploy the verified docs app to Vercel

**Files:**

- Inspect only: `.vercel/project.json`, `apps/docs/vercel.json`

- [ ] **Step 1: Confirm Vercel CLI authentication and project linkage**

Run:

```powershell
vercel whoami
vercel project ls
```

Expected: the CLI is authenticated and the linked project is `abba-ui`.

- [ ] **Step 2: Deploy the local verified tree to production**

Run from `apps/docs`:

```powershell
vercel --prod
```

Expected: Vercel uses `apps/docs/vercel.json`, runs `cd ../.. && pnpm install --frozen-lockfile`, builds `@abbainitiative/docs` through Turborepo, and prints a production URL.

- [ ] **Step 3: Verify the deployed routes**

Open the production URL and check `/`, `/docs`, `/docs/components`, and `/docs/tokens`. Confirm the deployment is not showing a build error and that the token page renders data from the registry package.
