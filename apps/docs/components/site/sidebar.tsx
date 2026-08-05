"use client";

import { Input, VisuallyHidden } from "@abbainitiative/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { navigation } from "@/content/navigation";
import styles from "./sidebar.module.css";

/**
 * Documentation navigation with a filter.
 *
 * A client component because it needs the current pathname to highlight the
 * active page and holds the filter query. The rest of the layout chrome around
 * it stays on the server.
 */
export function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}): React.JSX.Element {
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");

  const sections = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return navigation;

    return navigation
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(term) ||
            item.summary?.toLowerCase().includes(term) ||
            section.title.toLowerCase().includes(term),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  const resultCount = sections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <nav>
      <div className={styles.filter}>
        <Input
          type="search"
          size="sm"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Filter…"
          aria-label="Filter documentation"
        />
      </div>

      {/*
        Announce how many pages matched. Without this, a screen-reader user
        typing into the filter gets no feedback that the list changed at all.
      */}
      <VisuallyHidden aria-live="polite" as="div">
        {query ? `${String(resultCount)} pages match ${query}` : ""}
      </VisuallyHidden>

      {sections.length === 0 ? (
        <p className={styles.empty}>No pages match “{query}”.</p>
      ) : null}

      {sections.map((section) => (
        <div className={styles.section} key={section.title}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <ul className={styles.list}>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
