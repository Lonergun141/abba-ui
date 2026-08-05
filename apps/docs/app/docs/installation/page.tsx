import { Alert } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { InstallationCommand } from "@/components/docs/installation-command";
import { PageNav } from "@/components/docs/page-nav";
import { PACKAGE_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "Installation",
  description: `How to install ${PACKAGE_NAME} and load its stylesheet.`,
};

const NEXT_LAYOUT = `// app/layout.tsx
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

const VITE_ENTRY = `// src/main.tsx
import "${PACKAGE_NAME}/styles.css";
import "./index.css";`;

const FIRST_COMPONENT = `import { Button, Card, CardBody, Heading, Stack } from "${PACKAGE_NAME}";

export function Welcome() {
  return (
    <Card variant="elevated">
      <CardBody>
        <Stack gap={4}>
          <Heading level={2}>Everything is wired up</Heading>
          <Button>Continue</Button>
        </Stack>
      </CardBody>
    </Card>
  );
}`;

export default function InstallationPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Getting started</span>
      <h1>Installation</h1>
      <p className="lead">
        Two steps: add the package, then import the stylesheet once at the root of your
        application.
      </p>

      <h2>Requirements</h2>
      <ul>
        <li>
          <strong>React 18.2 or 19.</strong> Both are declared as peer dependencies, so
          your application decides the version.
        </li>
        <li>
          <strong>Node 20.11 or newer</strong> for the build tooling. The published
          package itself has no Node requirement at runtime.
        </li>
        <li>
          <strong>
            A bundler that understands the <code>exports</code> field
          </strong>{" "}
          — Next.js, Vite, Rspack, Parcel and webpack 5 all do.
        </li>
      </ul>

      <h2>1. Install the package</h2>
      <InstallationCommand />

      <p>
        <code>react</code> and <code>react-dom</code> are peer dependencies and are not
        installed for you. Radix primitives are regular dependencies and come along
        automatically.
      </p>

      <h2>2. Import the stylesheet</h2>
      <p>
        Import it once, as high in the tree as you can. Importing it in a component file
        works but risks ordering surprises when several components load in different
        orders.
      </p>

      <h3>Next.js App Router</h3>
      <CodeBlock code={NEXT_LAYOUT} />

      <h3>Vite, Create React App, or any plain React setup</h3>
      <CodeBlock code={VITE_ENTRY} />

      <Alert tone="warning" title="Import order matters">
        Import ABBA&apos;s stylesheet <em>before</em> your own. Both define rules at
        similar specificity, so whichever loads last wins — and you almost always want
        your overrides to be the ones that win.
      </Alert>

      <h2>3. Use a component</h2>
      <CodeBlock code={FIRST_COMPONENT} />

      <h2>Verifying the install</h2>
      <p>
        If a button renders as unstyled browser chrome, the stylesheet did not load. The
        usual causes are:
      </p>
      <ul>
        <li>
          The import lives in a file that is never reached — check it is in the{" "}
          <em>root</em> layout, not a nested one that only some routes use.
        </li>
        <li>
          A CSS pipeline that strips imports from <code>node_modules</code>. Some
          hand-rolled webpack configs exclude <code>node_modules</code> from their CSS
          rule.
        </li>
        <li>
          A test environment with no CSS handling. That is expected — jsdom does not
          apply stylesheets, and your component tests do not need it to.
        </li>
      </ul>

      <h2>TypeScript</h2>
      <p>
        Declarations are published alongside the JavaScript, and each subpath resolves
        its own types. No <code>@types</code> package is needed, and no{" "}
        <code>paths</code> mapping is required — but your <code>tsconfig.json</code>{" "}
        must use <code>&quot;moduleResolution&quot;: &quot;bundler&quot;</code> (or{" "}
        <code>&quot;node16&quot;</code>/<code>&quot;nodenext&quot;</code>) for the{" "}
        <code>exports</code> field to be honoured. The legacy{" "}
        <code>&quot;node&quot;</code> resolution ignores <code>exports</code> entirely
        and will fail to find the subpaths.
      </p>

      <p>
        Next: <Link href="/docs/nextjs">the Next.js guide</Link> for App Router
        specifics, or <Link href="/docs/react">the React guide</Link> for everything
        else.
      </p>

      <PageNav pathname="/docs/installation" />
    </article>
  );
}
