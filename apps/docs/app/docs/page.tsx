import { Alert } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import { components } from "@/content/registry";
import { PACKAGE_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "What ABBA UI is, what it deliberately is not, and the decisions behind how it is built.",
};

const IMPORT_EXAMPLE = `// Both work. The subpath import is narrower, which helps
// bundlers that do not handle side-effect analysis well.
import { Button } from "${PACKAGE_NAME}";
import { Button } from "${PACKAGE_NAME}/button";`;

export default function IntroductionPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Getting started</span>
      <h1>Introduction</h1>
      <p className="lead">
        ABBA UI is the component library of the ABBA Design System: {components.length}{" "}
        accessible React components, distributed as <code>{PACKAGE_NAME}</code>, built
        for Next.js App Router applications and plain React alike.
      </p>

      <h2>What it gives you</h2>
      <ul>
        <li>
          <strong>One stylesheet, no build coupling.</strong> Styles are compiled into a
          single CSS file built on custom properties. There is no Tailwind requirement,
          no PostCSS plugin to register, and no content-scanning configuration to keep
          in sync with your source layout.
        </li>
        <li>
          <strong>Correct Server Component behaviour.</strong> The{" "}
          <code>&quot;use client&quot;</code> directive is placed per component, never
          at the package root. Layout and typography components render on the server;
          interactive ones bring their own boundary with them.
        </li>
        <li>
          <strong>Theming through CSS variables.</strong> Every visual decision is a
          token. Override the tokens in your own stylesheet and the system follows — no
          provider, no runtime, and it works inside Server Components because it is only
          CSS.
        </li>
        <li>
          <strong>Accessibility as part of the component.</strong> Focus management,
          ARIA relationships and keyboard behaviour ship with each component and are
          asserted in tests, including automated axe checks.
        </li>
      </ul>

      <h2>What it deliberately is not</h2>
      <p>
        It is not a design-token-only package, and it is not a headless library.
        Behaviour that is genuinely hard to implement correctly — focus trapping, roving
        tabindex, collision-aware positioning — is delegated to Radix primitives, which
        are treated as an invisible behaviour layer. Nothing of Radix&apos;s API
        surfaces in ABBA&apos;s own props, so the dependency can be revisited without a
        breaking change for you.
      </p>
      <p>
        It is also not a kitchen sink. There is no data grid, no date picker, no rich
        text editor. Those components have deep requirements that a general-purpose
        library tends to serve badly, and every one of them added is a permanent
        maintenance cost paid by every consumer.
      </p>

      <h2>Importing</h2>
      <p>
        The package exposes a root entry and a subpath per component. Both are valid;
        pick whichever reads better in your codebase.
      </p>
      <CodeBlock code={IMPORT_EXAMPLE} />

      <Alert tone="info" title="Import the stylesheet once">
        Components have no inline styles to fall back on. Without{" "}
        <code>{PACKAGE_NAME}/styles.css</code> in your root layout, everything renders
        unstyled. See <Link href="/docs/installation">Installation</Link>.
      </Alert>

      <h2>Browser support</h2>
      <p>
        The stylesheet uses CSS custom properties, logical properties,{" "}
        <code>color-mix()</code> and container-friendly layout primitives. That targets
        evergreen Chrome, Edge, Firefox and Safari. Internet Explorer is not supported
        and will not be.
      </p>

      <h2>Where to next</h2>
      <ul>
        <li>
          <Link href="/docs/installation">Installation</Link> — add the package and wire
          up the stylesheet.
        </li>
        <li>
          <Link href="/docs/nextjs">Next.js</Link> — App Router specifics, including
          where client boundaries land.
        </li>
        <li>
          <Link href="/docs/tokens">Design tokens</Link> — the full token reference.
        </li>
        <li>
          <Link href="/docs/components">Components</Link> — every component with live
          examples.
        </li>
      </ul>

      <PageNav pathname="/docs" />
    </article>
  );
}
