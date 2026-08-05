import {
  Badge,
  Button,
  Card,
  CardBody,
  Heading,
  Inline,
  Stack,
  Text,
} from "@abbainitiative/ui";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { InstallationCommand } from "@/components/docs/installation-command";
import { components } from "@/content/registry";
import { PACKAGE_NAME, PACKAGE_VERSION } from "@/content/site";

const USAGE = `// app/page.tsx — a Server Component, no "use client" needed
import { Button, Card, CardBody, Heading, Stack } from "${PACKAGE_NAME}";

export default function Page() {
  return (
    <Card variant="elevated">
      <CardBody>
        <Stack gap={4}>
          <Heading level={1}>Welcome back</Heading>
          <Button>Get started</Button>
        </Stack>
      </CardBody>
    </Card>
  );
}`;

const SETUP = `// app/layout.tsx — import the stylesheet once
import "${PACKAGE_NAME}/styles.css";`;

interface Feature {
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    title: "No Tailwind required",
    body: "Styles ship as one compiled stylesheet built on CSS custom properties. Import it once and you are done — no PostCSS pipeline, no config file, no build-step coupling to your application.",
  },
  {
    title: "Server Components by default",
    body: 'Every component carries its own "use client" boundary, never the package root. Layout and typography render on the server; only the components that genuinely need state cross into the client.',
  },
  {
    title: "Themed with CSS variables",
    body: "Override any token in your own stylesheet and the whole system follows. No provider to mount, no runtime cost, and theming works in Server Components because it is only CSS.",
  },
  {
    title: "Accessible by construction",
    body: "Focus management, ARIA relationships and keyboard interaction are part of each component, not an afterthought. Every component is tested against axe in CI.",
  },
  {
    title: "Tree-shakeable",
    body: "Per-component chunks with an explicit export map, so importing a Badge does not pull in a dialog, a menu and a positioning engine.",
  },
  {
    title: "Typed end to end",
    body: "Written in strict TypeScript with hand-checked declarations. Variants, tones and sizes are unions, so a typo is a build error rather than a silently unstyled element.",
  },
];

export default function LandingPage(): React.JSX.Element {
  return (
    <main id="main-content" className="landing">
      <section className="hero">
        <Badge tone="primary" variant="subtle">
          v{PACKAGE_VERSION}
        </Badge>

        <h1 className="heroTitle">
          Components for React and Next.js that behave themselves
        </h1>

        <p className="heroLead">
          ABBA UI is the component library of the ABBA Design System —{" "}
          {components.length} accessible, themeable components that drop into a Next.js
          App Router project without a Tailwind install, a provider, or a build-step
          negotiation.
        </p>

        <div className="heroActions">
          <Button size="lg" asChild>
            <Link href="/docs">Read the docs</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs/components">Browse components</Link>
          </Button>
        </div>

        <div className="heroInstall">
          <InstallationCommand />
        </div>
      </section>

      <section className="landingSection" aria-labelledby="features-heading">
        <h2 className="landingSectionTitle" id="features-heading">
          Why it is built this way
        </h2>

        <div className="featureGrid">
          {FEATURES.map((feature) => (
            <Card key={feature.title} as="article" variant="outlined">
              <CardBody>
                <Stack gap={2}>
                  <Heading level={3} size="sm">
                    {feature.title}
                  </Heading>
                  <Text size="sm" tone="muted">
                    {feature.body}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="landingSection" aria-labelledby="usage-heading">
        <h2 className="landingSectionTitle" id="usage-heading">
          Two imports and you are running
        </h2>
        <p className="landingSectionLead">
          One stylesheet import in your root layout, then components anywhere —
          including inside Server Components.
        </p>

        <Stack gap={4} fullWidth>
          <CodeBlock code={SETUP} />
          <CodeBlock code={USAGE} />
        </Stack>
      </section>

      <section className="landingSection" aria-labelledby="next-heading">
        <h2 className="landingSectionTitle" id="next-heading">
          Where to go next
        </h2>

        <Inline gap={3}>
          <Button variant="secondary" asChild>
            <Link href="/docs/installation">Installation</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/docs/nextjs">Next.js guide</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/docs/tokens">Design tokens</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/docs/accessibility">Accessibility</Link>
          </Button>
        </Inline>
      </section>
    </main>
  );
}
