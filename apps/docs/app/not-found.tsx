import { Button, Inline } from "@abbainitiative/ui";
import Link from "next/link";
import type * as React from "react";

export default function NotFound(): React.JSX.Element {
  return (
    <main id="main-content" className="landing">
      <section className="hero">
        <h1 className="heroTitle">Page not found</h1>
        <p className="heroLead">
          That page does not exist. It may have moved, or a component may have been
          renamed between releases.
        </p>
        <div className="heroActions">
          <Inline gap={3}>
            <Button asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/components">All components</Link>
            </Button>
          </Inline>
        </div>
      </section>
    </main>
  );
}
