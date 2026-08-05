import { Badge } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import docs from "@/components/docs/docs.module.css";
import { PageNav } from "@/components/docs/page-nav";
import { components } from "@abbainitiative/registry";
import { PACKAGE_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "Next.js",
  description:
    "Using ABBA UI in the Next.js App Router: client boundaries, server rendering, and theming without a flash.",
};

const LAYOUT = `// app/layout.tsx — a Server Component
import "${PACKAGE_NAME}/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const SERVER_PAGE = `// app/dashboard/page.tsx
// No "use client" here. Button and Input carry their own boundaries.
import { Button, Card, CardBody, Heading, Input, Stack } from "${PACKAGE_NAME}";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <Card>
      <CardBody>
        <Stack gap={4}>
          <Heading level={1}>Hello, {user.name}</Heading>
          <Input aria-label="Search" placeholder="Search…" />
          <Button>Refresh</Button>
        </Stack>
      </CardBody>
    </Card>
  );
}`;

const HANDLER = `// This fails — a Server Component cannot pass a function to a
// Client Component.
export default function Page() {
  return <Button onClick={() => save()}>Save</Button>;
}

// This works — move the handler into a client island.
"use client";

export function SaveButton() {
  return <Button onClick={() => save()}>Save</Button>;
}`;

const TOAST_SETUP = `// app/providers.tsx
"use client";

import { ToastProvider } from "${PACKAGE_NAME}";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

// app/layout.tsx — still a Server Component
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

const NO_TRANSPILE = `// next.config.ts
// transpilePackages is NOT needed. The package ships compiled ESM with
// "use client" already in place. Adding it makes Next.js recompile the
// source, which is slower and can move the client boundary.
export default {};`;

export default function NextjsPage(): React.JSX.Element {
  const serverSafe = components.filter((component) => component.serverSafe);
  const clientOnly = components.filter((component) => !component.serverSafe);

  return (
    <article className="prose">
      <span className="eyebrow">Getting started</span>
      <h1>Next.js</h1>
      <p className="lead">
        ABBA UI is built for the App Router. The library&apos;s central design decision
        is where the <code>&quot;use client&quot;</code> directive lives — and it is
        never at the package root.
      </p>

      <h2>Setup</h2>
      <p>
        Import the stylesheet in your root layout. The layout itself stays a Server
        Component.
      </p>
      <CodeBlock code={LAYOUT} />

      <h2>Do not add transpilePackages</h2>
      <p>
        A common instinct with a component library is to add it to{" "}
        <code>transpilePackages</code>. Do not. This package publishes compiled ESM with
        the directives already emitted in the right places; recompiling it is slower and
        can shift the boundary Next.js sees.
      </p>
      <CodeBlock code={NO_TRANSPILE} />
      <p>
        This documentation site is itself the proof: it consumes the built package with
        no <code>transpilePackages</code> entry, so a regression in the published
        artefact breaks this site&apos;s build.
      </p>

      <h2>Why the directive placement matters</h2>
      <p>
        A library that puts <code>&quot;use client&quot;</code> at the top of its barrel
        file makes every component a Client Component — including a <code>Stack</code>{" "}
        that only sets <code>display: flex</code>. Importing one button then drags the
        entire library across the boundary and into the client bundle.
      </p>
      <p>
        Here, each component file carries its own directive. A page importing{" "}
        <code>Heading</code> and <code>Stack</code> stays entirely on the server; a page
        importing <code>Button</code> ships only the button.
      </p>

      <p>
        Here is a real Server Component page. It fetches data, renders four ABBA
        components, and never declares a client boundary of its own.
      </p>
      <CodeBlock code={SERVER_PAGE} />

      <h3>Server-renderable components</h3>
      <p>
        These render inside a Server Component with no boundary of your own. They have
        no state and no event handlers.
      </p>
      <p className={docs.chipRow}>
        {serverSafe.map((component) => (
          <Link
            key={component.slug}
            href={`/docs/components/${component.slug}`}
            className={docs.chipLink}
          >
            <Badge tone="success" variant="subtle">
              {component.name}
            </Badge>
          </Link>
        ))}
      </p>

      <h3>Components with their own client boundary</h3>
      <p>
        These carry <code>&quot;use client&quot;</code> internally. You can still render
        them from a Server Component — you simply cannot pass them a function.
      </p>
      <p className={docs.chipRow}>
        {clientOnly.map((component) => (
          <Link
            key={component.slug}
            href={`/docs/components/${component.slug}`}
            className={docs.chipLink}
          >
            <Badge tone="accent" variant="subtle">
              {component.name}
            </Badge>
          </Link>
        ))}
      </p>

      <h2>The one rule to remember</h2>
      <p>
        A Server Component may <em>render</em> a Client Component, but it may not{" "}
        <em>pass a function to one</em>. Functions cannot be serialised across the
        boundary. So <code>&lt;Button&gt;Save&lt;/Button&gt;</code> is fine from the
        server, while <code>&lt;Button onClick=&#123;…&#125;&gt;</code> is not.
      </p>
      <CodeBlock code={HANDLER} />
      <p>
        In practice this means your interactive islands are small: a form, a menu bar, a
        settings panel. Everything around them — the page shell, headings, cards,
        badges, static alerts — stays on the server.
      </p>

      <h2>Toasts</h2>
      <p>
        <code>ToastProvider</code> uses context, so it needs a client boundary. Wrap it
        in your own client module and mount that from the server layout — the layout
        stays a Server Component, and only the provider crosses over.
      </p>
      <CodeBlock code={TOAST_SETUP} />

      <h2>Theming without a flash</h2>
      <p>
        Dark mode is driven by a <code>data-theme</code> attribute, so it can be set
        before React hydrates. See <Link href="/docs/dark-mode">Dark mode</Link> for the
        blocking script that avoids a flash of the wrong theme.
      </p>

      <h2>Streaming and Suspense</h2>
      <p>
        Nothing in the library reads from the request, uses <code>useLayoutEffect</code>{" "}
        at module scope, or otherwise interferes with streaming. Components inside a{" "}
        <code>&lt;Suspense&gt;</code> boundary stream normally, and <code>Spinner</code>{" "}
        is a reasonable fallback — it announces itself as{" "}
        <code>role=&quot;status&quot;</code>, so the wait is not silent for screen
        reader users.
      </p>

      <h2>Turbopack</h2>
      <p>
        Supported with no configuration. The package is plain ESM with a static{" "}
        <code>exports</code> map, which is what Turbopack resolves best.
      </p>

      <PageNav pathname="/docs/nextjs" />
    </article>
  );
}
