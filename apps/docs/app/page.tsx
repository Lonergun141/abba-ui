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
  Text,
  Textarea,
} from "@abbainitiative/ui";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { InstallationCommand } from "@/components/docs/installation-command";
import styles from "@/components/landing/landing.module.css";
import { ThemePlayground } from "@/components/landing/theme-playground";
import { components } from "@abbainitiative/registry";
import { PACKAGE_NAME, PACKAGE_VERSION } from "@/content/site";

const SETUP = `// app/layout.tsx
import "${PACKAGE_NAME}/styles.css";

// Then anywhere, including Server Components:
import { Button, Card } from "${PACKAGE_NAME}";`;

export default function LandingPage(): React.JSX.Element {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          ABBA Design System
          <span className={styles.eyebrowRule} aria-hidden="true" />v{PACKAGE_VERSION}
        </p>

        <h1 className={styles.headline}>
          A component library you can make{" "}
          <span className={styles.headlineTurn}>look like yours</span>.
        </h1>

        <p className={styles.heroLead}>
          {components.length} accessible React components for Next.js and plain React.
          Install the package, import one stylesheet, and change any colour, size or
          radius by overriding a CSS variable.
        </p>

        <div className={styles.heroActions}>
          <Button size="lg" asChild>
            <Link href="/docs/installation">Get started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs/components">Browse components</Link>
          </Button>
        </div>

        <div className={styles.heroInstall}>
          <InstallationCommand />
        </div>
      </section>

      <ul className={styles.claims}>
        <li className={styles.claim}>
          <span className={styles.claimTerm}>One stylesheet</span>
          <span className={styles.claimDetail}>
            No Tailwind, no PostCSS plugin, nothing to configure.
          </span>
        </li>
        <li className={styles.claim}>
          <span className={styles.claimTerm}>No provider</span>
          <span className={styles.claimDetail}>
            Theming is plain CSS, so there is nothing to mount.
          </span>
        </li>
        <li className={styles.claim}>
          <span className={styles.claimTerm}>Server Components</span>
          <span className={styles.claimDetail}>
            Drop them straight into a Next.js layout or page.
          </span>
        </li>
      </ul>

      <section className={styles.section} aria-labelledby="theme-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="theme-heading">
            Change two things. Watch everything follow.
          </h2>
          <p className={styles.sectionNote}>
            Pick an accent and a corner style below. The components are real, and so is
            the CSS — it is the same override you would put in your own stylesheet.
          </p>
        </div>

        <ThemePlayground />
      </section>

      <section className={styles.section} aria-labelledby="components-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="components-heading">
            Buttons, forms, cards, feedback.
          </h2>
          <p className={styles.sectionNote}>
            Everything on this page is the published package rendering live. Switch the
            theme in the header to see the dark set.
          </p>
        </div>

        <div className={styles.specimens}>
          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Buttons</span>
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
            <span className={styles.specimenLabel}>Form fields</span>
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
            <span className={styles.specimenLabel}>Validation</span>
            <div className={styles.specimenStage}>
              <FormField label="Username" error="That username is already taken.">
                <Input defaultValue="ada" />
              </FormField>
              <Textarea aria-label="Notes" placeholder="Add a note…" />
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Messages</span>
            <div className={styles.specimenStage}>
              <Alert tone="danger" title="Payment failed">
                Update your card details to continue.
              </Alert>
              <Alert tone="success" title="Saved">
                Your changes are live.
              </Alert>
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Status</span>
            <div className={styles.specimenStage}>
              <Inline gap={2}>
                <Badge tone="success" dot>
                  Active
                </Badge>
                <Badge tone="warning">Pending</Badge>
                <Badge tone="danger" variant="solid" srLabel="Status:">
                  Overdue
                </Badge>
              </Inline>
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
            </div>
          </div>

          <div className={styles.specimen}>
            <span className={styles.specimenLabel}>Cards</span>
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
        </div>
      </section>

      <section className={styles.section} aria-labelledby="setup-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="setup-heading">
            Two imports, then you&apos;re building.
          </h2>
          <p className={styles.sectionNote}>
            Import the stylesheet once at the root of your app. After that, components
            go wherever you need them.
          </p>
        </div>

        <CodeBlock code={SETUP} />
      </section>

      <section className={styles.section} aria-labelledby="index-heading">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle} id="index-heading">
            All {components.length} components.
          </h2>
          <p className={styles.sectionNote}>
            Each page has live examples, the full prop reference, and the keyboard and
            screen-reader behaviour that component guarantees.
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
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.cta} aria-labelledby="cta-heading">
        <h2 className={styles.ctaTitle} id="cta-heading">
          Add it to your project.
        </h2>
        <div className={styles.ctaInstall}>
          <InstallationCommand />
        </div>
        <Inline gap={3}>
          <Button asChild>
            <Link href="/docs/installation">Installation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/theming">Theming</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/docs/accessibility">Accessibility</Link>
          </Button>
        </Inline>
      </section>
    </main>
  );
}
