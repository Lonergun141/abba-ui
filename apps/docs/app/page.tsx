import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormField,
  Heading,
  Inline,
  Input,
  Stack,
  Text,
} from "@abbainitiative/ui";
import Link from "next/link";
import type * as React from "react";

import { InstallationCommand } from "@/components/docs/installation-command";
import { BoundaryTree } from "@/components/landing/boundary-tree";
import styles from "@/components/landing/landing.module.css";
import { components } from "@/content/registry";
import { PACKAGE_VERSION } from "@/content/site";

/**
 * The landing page.
 *
 * Note the imports: Card, Badge, Heading, Stack and the rest render on the
 * server from this file, with no client boundary of its own. Only BoundaryTree
 * and InstallationCommand are client modules, because only they hold state.
 * The page is an instance of the thing it argues for.
 */

export default function LandingPage(): React.JSX.Element {
  const clientComponents = components.filter((component) => !component.serverSafe);

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          ABBA Design System
          <span className={styles.eyebrowRule} aria-hidden="true" />v{PACKAGE_VERSION}
        </p>

        <h1 className={styles.headline}>
          One import shouldn&apos;t cost you{" "}
          <span className={styles.headlineTurn}>the server</span>.
        </h1>

        <div className={styles.heroGrid}>
          <div>
            <p className={styles.heroLead}>
              Most component libraries put <code>&quot;use client&quot;</code> at the
              top of their barrel file. Import one button and your whole layout crosses
              into the client bundle. ABBA UI puts it on the {clientComponents.length}{" "}
              components that genuinely need it, and nowhere else.
            </p>

            <div className={styles.heroActions}>
              <Button size="lg" asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/components">
                  Browse {components.length} components
                </Link>
              </Button>
            </div>

            <div className={styles.heroInstall}>
              <InstallationCommand />
            </div>
          </div>

          <BoundaryTree />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="specimens-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="specimens-heading">
            These are the components, not pictures of them.
          </h2>
          <p className={styles.sectionNote}>
            Everything below is rendered by the published package, in this page, at the
            size you are reading it. Switch the theme in the header and watch it follow.
          </p>
        </div>

        <div className={styles.specimens}>
          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Actions</span>
            <div className={styles.specimenStage}>
              <Inline gap={2}>
                <Button>Save</Button>
                <Button variant="secondary">Duplicate</Button>
              </Inline>
              <Inline gap={2}>
                <Button variant="outline">Cancel</Button>
                <Button variant="danger">Delete</Button>
              </Inline>
              <Inline gap={2}>
                <Button size="sm" loading>
                  Saving
                </Button>
                <Button size="sm" variant="ghost">
                  Discard
                </Button>
              </Inline>
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Forms</span>
            <div className={styles.specimenStage}>
              <FormField
                label="Email address"
                description="We only use this to sign you in."
                required
              >
                <Input type="email" placeholder="you@example.com" />
              </FormField>
              <FormField label="Amount">
                <Input prefix="₱" suffix=".00" defaultValue="12,400" />
              </FormField>
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Feedback</span>
            <div className={styles.specimenStage}>
              <Alert tone="danger" title="Payment failed">
                Update your card details to continue.
              </Alert>
              <Inline gap={2}>
                <Badge tone="success" dot>
                  Active
                </Badge>
                <Badge tone="warning">Pending</Badge>
                <Badge tone="danger" variant="solid" srLabel="Status:">
                  Overdue
                </Badge>
              </Inline>
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Surfaces</span>
            <div className={styles.specimenStage}>
              <Card variant="elevated">
                <CardHeader>
                  <Heading level={3} size="sm">
                    Monthly report
                  </Heading>
                  <Text size="sm" tone="muted">
                    Generated 5 August
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text size="sm">Contributions rose 12% against the last period.</Text>
                </CardBody>
                <CardFooter divided>
                  <Button size="sm">Download</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Typography</span>
            <div className={styles.specimenStage}>
              <Stack gap={2}>
                <Heading level={3} size="lg">
                  Rank and size are separate
                </Heading>
                <Text>
                  So an <code>h3</code> can look large without lying about the document
                  outline.
                </Text>
                <Text size="sm" tone="muted">
                  Muted supporting copy.
                </Text>
              </Stack>
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Theming</span>
            <div className={styles.specimenStage}>
              <Stack gap={3}>
                <Text size="sm" tone="muted">
                  Every colour, size and radius is a CSS variable. Override the ones you
                  want and the whole system follows.
                </Text>
                <Inline gap={2}>
                  <Badge tone="primary" variant="subtle">
                    subtle
                  </Badge>
                  <Badge tone="primary" variant="solid">
                    solid
                  </Badge>
                  <Badge tone="primary" variant="outline">
                    outline
                  </Badge>
                </Inline>
              </Stack>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="index-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="index-heading">
            The whole set.
          </h2>
          <p className={styles.sectionNote}>
            {components.length} components. {clientComponents.length} of them carry a
            client boundary; the rest render on the server with nothing asked of you.
          </p>
        </div>

        <ul className={styles.index}>
          {components.map((component) => (
            <li key={component.slug}>
              <Link
                className={styles.indexLink}
                href={`/docs/components/${component.slug}`}
              >
                {component.name}
                {component.serverSafe ? null : (
                  <span className={styles.indexMark} aria-hidden="true" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.indexMark} aria-hidden="true" />
            carries its own <code>&quot;use client&quot;</code>
          </span>
          <span className={styles.legendItem}>
            everything else renders on the server
          </span>
        </p>
      </section>

      <section className={styles.section} aria-labelledby="facts-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="facts-heading">
            What it does not ask of you.
          </h2>
          <p className={styles.sectionNote}>
            A component library becomes hard to live with through the things it demands
            from the rest of your build. This one demands two imports.
          </p>
        </div>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>No Tailwind</dt>
            <dd className={styles.factDetail}>
              Styles ship as one compiled stylesheet built on CSS custom properties. No
              PostCSS plugin to register, no content-scanning config to keep in sync
              with how you lay out your source.
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>No provider</dt>
            <dd className={styles.factDetail}>
              Theming is a stylesheet override, so there is nothing to mount, no runtime
              cost, and it works unchanged inside Server Components.
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>
              No <code>transpilePackages</code>
            </dt>
            <dd className={styles.factDetail}>
              The package ships compiled ESM with the directives already in place. This
              site consumes that build directly, so a regression in the published
              artefact breaks the page you are reading.
            </dd>
          </div>
          <div className={styles.fact}>
            <dt className={styles.factTerm}>No accessibility backlog</dt>
            <dd className={styles.factDetail}>
              Keyboard interaction, focus management and ARIA relationships ship with
              each component and are asserted in tests, including an automated axe pass
              in CI.
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.cta} aria-labelledby="cta-heading">
        <h2 className={styles.ctaTitle} id="cta-heading">
          Add it to a project.
        </h2>
        <div className={styles.ctaInstall}>
          <InstallationCommand />
        </div>
        <Inline gap={3}>
          <Button asChild>
            <Link href="/docs/installation">Installation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/nextjs">Next.js guide</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/docs/tokens">Design tokens</Link>
          </Button>
        </Inline>
      </section>
    </main>
  );
}
