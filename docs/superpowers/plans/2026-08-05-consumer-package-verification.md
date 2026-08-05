# Published Package Consumer Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Verify the public `@abbainitiative/ui@0.1.0` package in a clean Next.js app using Playwright and browser inspection, then publish the approved ABBA UI repository changes and redeploy Vercel.

**Architecture:** A sibling Next.js App Router app at `C:\dev\abba-ui-consumer-e2e` consumes the package only from npm. Its page is a focused package smoke surface; Playwright checks rendered components, CSS custom properties, theme overrides, and interaction state.

**Tech Stack:** Next.js App Router, React, TypeScript, pnpm, `@abbainitiative/ui`, Playwright, Vercel CLI, GitHub CLI.

---

### Task 1: Scaffold the isolated consumer app

**Files:** Create the sibling app with `create-next-app` at `C:\dev\abba-ui-consumer-e2e`.

- [ ] **Step 1: Scaffold a Next.js App Router TypeScript app**

Run:

```powershell
pnpm dlx create-next-app@latest C:\dev\abba-ui-consumer-e2e --typescript --eslint --app --src-dir --use-pnpm --import-alias "@/*" --no-tailwind --yes
```

- [ ] **Step 2: Install the published package and Playwright**

Run from the new app:

```powershell
pnpm add @abbainitiative/ui
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

Expected: the dependency resolves from `https://registry.npmjs.org`, and Chromium installs successfully.

### Task 2: Build the package smoke surface

**Files:**

- Modify: `C:\dev\abba-ui-consumer-e2e\src\app\layout.tsx`
- Modify: `C:\dev\abba-ui-consumer-e2e\src\app\page.tsx`
- Modify: `C:\dev\abba-ui-consumer-e2e\src\app\globals.css`

- [ ] **Step 1: Import the published stylesheet and define metadata**

In `layout.tsx`, import `@abbainitiative/ui/styles.css` and set the page metadata title to `ABBA UI Consumer Check`.

- [ ] **Step 2: Render representative components and theme controls**

In `page.tsx`, import `Container`, `Stack`, `Heading`, `Text`, `Button`, `Card`, `Badge`, `Input`, and `Alert` from `@abbainitiative/ui`. Add a client-side theme toggle and a button counter, using stable `data-testid` attributes for Playwright.

- [ ] **Step 3: Add only consumer-level theme overrides**

In `globals.css`, set application variables such as `--abba-primary` and `--abba-surface` without changing the installed package. Add readable layout styles and a dark-theme override under `[data-theme="dark"]`.

- [ ] **Step 4: Run the consumer typecheck and build**

Run:

```powershell
pnpm exec tsc --noEmit
pnpm build
```

Expected: both commands exit 0 and the app compiles against the published package.

### Task 3: Add and run Playwright E2E checks

**Files:**

- Create: `C:\dev\abba-ui-consumer-e2e\playwright.config.ts`
- Create: `C:\dev\abba-ui-consumer-e2e\tests\ui-package.spec.ts`

- [ ] **Step 1: Configure a local Next.js web server**

Configure Playwright to run Chromium against `http://127.0.0.1:3100` using `pnpm dev --hostname 127.0.0.1 --port 3100` as its web server.

- [ ] **Step 2: Test components, tokens, theming, and interaction**

The test must assert visible heading/badge/card/input/alert content, `--abba-primary` exists on `document.documentElement`, the primary button's computed background matches the override, the theme toggle sets `data-theme="dark"`, and the counter changes after clicking.

- [ ] **Step 3: Run the E2E suite**

Run:

```powershell
pnpm exec playwright test
```

Expected: all tests pass in Chromium with no console errors.

### Task 4: Inspect the app in the browser

- [ ] **Step 1: Start the app on port 3100**

Run:

```powershell
pnpm dev --hostname 127.0.0.1 --port 3100
```

- [ ] **Step 2: Open `http://127.0.0.1:3100` in the browser**

Inspect the rendered page, click the theme toggle, and confirm the visual theme changes without console errors.

### Task 5: Commit, push, and redeploy ABBA UI changes

**Files:** Only the approved existing ABBA UI repository changes; the consumer app remains outside the repository.

- [ ] **Step 1: Review scope and GitHub authentication**

Run `git status -sb`, inspect the diff, `gh --version`, and `gh auth status`. Do not stage unrelated user changes silently.

- [ ] **Step 2: Create an agent branch, commit approved files, and push**

Use the GitHub publish workflow with an intentional branch and explicit staging. Push the branch and open a draft PR if the repository workflow requires one.

- [ ] **Step 3: Deploy the verified ABBA UI repository to Vercel**

Run from `C:\dev\abba-ui`:

```powershell
pnpm dlx vercel --prod
```

- [ ] **Step 4: Verify production routes**

Check `/`, `/docs/installation`, `/docs/components`, and `/docs/tokens` return HTTP 200 and contain `@abbainitiative/ui`.
