import { Button, Inline, Text } from "@abbainitiative/ui";
import Link from "next/link";
import type * as React from "react";

import styles from "@/components/landing/landing.module.css";

export default function NotFound(): React.JSX.Element {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.notFound}>
        <p className={styles.eyebrow}>
          404
          <span className={styles.eyebrowRule} aria-hidden="true" />
          Not found
        </p>

        <h1 className={styles.headline}>That page isn&apos;t here.</h1>

        <Text tone="muted" size="lg">
          It may have moved, or a component may have been renamed between releases.
        </Text>

        <Inline gap={3}>
          <Button asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/components">All components</Link>
          </Button>
        </Inline>
      </div>
    </main>
  );
}
