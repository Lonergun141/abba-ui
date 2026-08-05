import { Alert } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import { PACKAGE_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "Rebrand ABBA UI by overriding CSS custom properties — no provider, no runtime, works in Server Components.",
};

const REBRAND = `/* app/theme.css — imported after ${PACKAGE_NAME}/styles.css */
:root {
  /* Repoint the semantic layer at your own palette. */
  --abba-primary: #4338ca;
  --abba-primary-hover: #3730a3;
  --abba-primary-active: #312e81;
  --abba-primary-foreground: #ffffff;
  --abba-primary-subtle: #eef2ff;
  --abba-primary-subtle-foreground: #312e81;

  --abba-accent: #be185d;
  --abba-accent-hover: #9d174d;
  --abba-accent-foreground: #ffffff;
}`;

const SHAPE = `/* A squarer, tighter system. */
:root {
  --abba-radius-sm: 2px;
  --abba-radius-md: 3px;
  --abba-radius-lg: 4px;
  --abba-radius-xl: 6px;
}`;

const FONT = `/* next/font, or any font you already load. */
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--app-font" });

/* Then in your stylesheet: */
:root {
  --abba-font-sans: var(--app-font), system-ui, sans-serif;
}`;

const SCOPED = `/* Themes do not have to be global. Any element can open a new
   scope, and everything inside it inherits. */
.marketingSection {
  --abba-primary: var(--abba-ember-500);
  --abba-primary-hover: var(--abba-ember-600);
  --abba-radius-md: var(--abba-radius-full);
}`;

const ESCAPE_HATCH = `import { Button } from "${PACKAGE_NAME}";
import styles from "./checkout.module.css";

/* Every component forwards className and merges it after its own,
   so a module class wins without !important. */
<Button className={styles.checkoutButton}>Pay now</Button>`;

const CONTRAST = `/* Verify overrides, do not assume them. A palette that looks
   right at a glance frequently fails AA:

   text on --abba-primary          → needs 4.5:1
   large text (18.66px+ bold, 24px+) → needs 3:1
   focus ring against its neighbour → needs 3:1
   borders that convey state        → needs 3:1                */`;

export default function ThemingPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Design system</span>
      <h1>Theming</h1>
      <p className="lead">
        Theming is a stylesheet, not an API. Override the{" "}
        <Link href="/docs/tokens">tokens</Link> you want to change and every component
        follows — no provider to mount, no context, no runtime cost, and it works
        unchanged inside Server Components.
      </p>

      <h2>How it works</h2>
      <p>
        Components reference semantic tokens like <code>--abba-primary</code> rather
        than literal colours. Redefining that property anywhere in the cascade changes
        every component below it. Because custom properties inherit, the scope of a
        theme is just the element you declare it on.
      </p>

      <h2>Rebranding</h2>
      <p>
        Start with the semantic layer. You rarely need to touch the Cedar and Ember
        palettes themselves — those exist so the semantic tokens have somewhere sensible
        to point by default.
      </p>
      <CodeBlock code={REBRAND} language="css" />

      <Alert tone="warning" title="Order matters">
        Your overrides must load <em>after</em> <code>{PACKAGE_NAME}/styles.css</code>.
        Both declare at <code>:root</code>, so identical specificity means source order
        decides the winner.
      </Alert>

      <h2>Shape</h2>
      <p>
        Radii carry as much brand identity as colour does. Flattening them changes the
        system&apos;s character more than most palette swaps.
      </p>
      <CodeBlock code={SHAPE} language="css" />

      <h2>Typography</h2>
      <p>
        The library ships no webfont, so there is nothing to override away — point{" "}
        <code>--abba-font-sans</code> at whatever you already load.
      </p>
      <CodeBlock code={FONT} language="tsx" />

      <h2>Scoped themes</h2>
      <p>
        A theme does not have to be global. Declare tokens on any element and only its
        subtree changes — useful for a marketing section, a tenant-specific area, or a
        preview pane showing another brand.
      </p>
      <CodeBlock code={SCOPED} language="css" />

      <h2>When tokens are not enough</h2>
      <p>
        Every component forwards <code>className</code> and merges it after its own
        classes, so a CSS module class wins on source order without needing{" "}
        <code>!important</code>. Reach for this when you need a one-off; if you find
        yourself doing it repeatedly for the same reason, that is usually a missing
        token rather than a missing override.
      </p>
      <CodeBlock code={ESCAPE_HATCH} />

      <h2>Check your contrast</h2>
      <p>
        The default palette was tuned to clear WCAG AA at every pairing the components
        actually use. An override discards that work, so verify the result rather than
        trusting how it looks.
      </p>
      <CodeBlock code={CONTRAST} language="css" />

      <p>
        Next: <Link href="/docs/dark-mode">dark mode</Link>, which is the same mechanism
        applied through a selector.
      </p>

      <PageNav pathname="/docs/theming" />
    </article>
  );
}
