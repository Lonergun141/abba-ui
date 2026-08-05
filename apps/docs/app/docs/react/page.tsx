import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import { PACKAGE_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "React",
  description:
    "Using ABBA UI in a plain React application: Vite, Remix, Astro, or any bundler.",
};

const VITE = `// src/main.tsx
import "${PACKAGE_NAME}/styles.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`;

const FORM = `import { Button, FormField, Input, Stack, Textarea } from "${PACKAGE_NAME}";
import { useState } from "react";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={5}>
        <FormField label="Name" error={errors.name} required>
          <Input name="name" />
        </FormField>

        <FormField
          label="Message"
          description="Tell us what you need."
          error={errors.message}
        >
          <Textarea name="message" autoSize />
        </FormField>

        <Button type="submit">Send</Button>
      </Stack>
    </form>
  );
}`;

const TOAST = `import { ToastProvider, useToast } from "${PACKAGE_NAME}";

function App() {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

function SaveButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={async () => {
        await save();
        toast({ title: "Saved", tone: "success" });
      }}
    >
      Save
    </Button>
  );
}`;

const STRICT = `// StrictMode double-invokes effects in development. That is a
// feature, not a bug — nothing in ABBA UI relies on an effect running
// exactly once, so components behave identically under it.`;

export default function ReactPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Getting started</span>
      <h1>React</h1>
      <p className="lead">
        Nothing in the library is Next.js-specific. The{" "}
        <code>&quot;use client&quot;</code> directives are inert outside a React Server
        Components bundler — they are simply string literals that every other bundler
        ignores.
      </p>

      <h2>Setup</h2>
      <p>Import the stylesheet at your entry point, before your own styles.</p>
      <CodeBlock code={VITE} />

      <h2>Forms</h2>
      <p>
        <code>FormField</code> generates the ids and wires <code>aria-describedby</code>
        , <code>aria-invalid</code> and the label&apos;s <code>htmlFor</code> for you.
        It works with uncontrolled forms, controlled state, and any form library that
        gives you an error string.
      </p>
      <CodeBlock code={FORM} />

      <h2>Toasts</h2>
      <p>
        Mount <code>ToastProvider</code> once near the root, then call{" "}
        <code>toast()</code> from anywhere below it.
      </p>
      <CodeBlock code={TOAST} />

      <h2>StrictMode</h2>
      <CodeBlock code={STRICT} language="ts" />

      <h2>Bundler notes</h2>
      <ul>
        <li>
          <strong>Vite, Rspack, webpack 5, Parcel, esbuild.</strong> All resolve the{" "}
          <code>exports</code> map with no configuration.
        </li>
        <li>
          <strong>Remix / React Router.</strong> Import the stylesheet through the route
          module&apos;s <code>links</code> export, or as a side-effect import in the
          root route — both work.
        </li>
        <li>
          <strong>Astro.</strong> Use the React integration and import the stylesheet in
          your layout. Components need a <code>client:*</code> directive only where they
          are actually interactive, which mirrors the Next.js split closely.
        </li>
        <li>
          <strong>Jest.</strong> Add a <code>moduleNameMapper</code> entry mapping{" "}
          <code>{"\\.css$"}</code> to a stub. Jest does not understand CSS imports, and
          the package imports its stylesheet from the entry file. Vitest handles this
          without configuration.
        </li>
      </ul>

      <h2>Tree-shaking</h2>
      <p>
        The package is published as ESM with per-component chunks and{" "}
        <code>&quot;sideEffects&quot;: [&quot;**/*.css&quot;]</code>, so a bundler can
        drop everything you do not import while keeping the stylesheet. If your bundler
        has weak side-effect analysis, import from the subpath —{" "}
        <code>{PACKAGE_NAME}/badge</code> — which makes the boundary explicit.
      </p>

      <p>
        Next: <Link href="/docs/tokens">the token reference</Link>.
      </p>

      <PageNav pathname="/docs/react" />
    </article>
  );
}
