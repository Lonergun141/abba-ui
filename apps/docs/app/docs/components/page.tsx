import { Badge } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import docs from "@/components/docs/docs.module.css";
import { PageNav } from "@/components/docs/page-nav";
import { components, componentsByCategory } from "@abbainitiative/registry";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${String(components.length)} components in the ABBA Design System, grouped by category.`,
};

export default function ComponentsIndexPage(): React.JSX.Element {
  const groups = componentsByCategory();

  return (
    <article className="prose">
      <span className="eyebrow">Components</span>
      <h1>All components</h1>
      <p className="lead">
        {components.length} components, grouped by what they are for. Each page carries
        live examples, the full prop reference, and the accessibility behaviour that
        component guarantees.
      </p>

      {groups.map((group) => (
        <section className={docs.indexGroup} key={group.category}>
          <h2>{group.category}</h2>
          <ul className={docs.indexGrid}>
            {group.items.map((component) => (
              <li key={component.slug}>
                <Link
                  className={docs.indexCard}
                  href={`/docs/components/${component.slug}`}
                >
                  <span className={docs.indexName}>{component.name}</span>
                  <span className={docs.indexSummary}>{component.summary}</span>
                  <span>
                    <Badge
                      tone={component.serverSafe ? "success" : "accent"}
                      variant="subtle"
                      size="sm"
                    >
                      {component.serverSafe ? "Server" : "Client"}
                    </Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <PageNav pathname="/docs/components" />
    </article>
  );
}
