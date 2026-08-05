"use client";

import * as React from "react";

import styles from "./landing.module.css";

/**
 * The landing page's thesis, rendered as the thing it is about.
 *
 * A real component tree with the client boundary drawn two ways. At the package
 * root — how most libraries ship — every component below the import becomes a
 * Client Component, so every row carries the directive. Per component, the way
 * this library ships, it lands on the two that actually hold state.
 *
 * The tree is a genuine one: these are real ABBA components, and the two marked
 * rows are the two that really carry `"use client"` in the published package.
 */

interface Row {
  /** Pre-drawn tree glyphs. Rendered with `white-space: pre`. */
  prefix: string;
  name: string;
  /** Whether this component carries the directive in the published package. */
  client?: boolean;
}

const ROWS: Row[] = [
  { prefix: "", name: "app/page.tsx" },
  { prefix: "└─ ", name: "Container" },
  { prefix: "   ├─ ", name: "Heading" },
  { prefix: "   ├─ ", name: "Card" },
  { prefix: "   │  ├─ ", name: "CardBody" },
  { prefix: "   │  │  ├─ ", name: "Text" },
  { prefix: "   │  │  └─ ", name: "Badge" },
  { prefix: "   │  └─ ", name: "CardFooter" },
  { prefix: "   │     └─ ", name: "Button", client: true },
  { prefix: "   └─ ", name: "Inline" },
  { prefix: "      └─ ", name: "Input", client: true },
];

/** Everything except the entry file, which is the consumer's own. */
const COMPONENT_COUNT = ROWS.filter((row) => row.name !== "app/page.tsx").length;
const CLIENT_COUNT = ROWS.filter((row) => row.client).length;

type Mode = "root" | "component";

const MODES: { value: Mode; label: string }[] = [
  { value: "root", label: "At the package root" },
  { value: "component", label: "Per component" },
];

export function BoundaryTree(): React.JSX.Element {
  const [mode, setMode] = React.useState<Mode>("component");

  const crossings = mode === "root" ? COMPONENT_COUNT : CLIENT_COUNT;

  return (
    <figure className={styles.tree}>
      <div className={styles.treeHead}>
        <span className={styles.treeLabel}>Where the boundary lands</span>
        <div
          className={styles.treeToggle}
          role="group"
          aria-label="Where the boundary lands"
        >
          {MODES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.treeToggleButton}
              aria-pressed={mode === option.value}
              onClick={() => {
                setMode(option.value);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.treeBody}>
        <ul className={styles.treeRows}>
          {ROWS.map((row, index) => {
            const isEntry = row.name === "app/page.tsx";
            const crosses = !isEntry && (mode === "root" || row.client === true);

            return (
              <li className={styles.treeRow} key={row.name}>
                <span className={styles.treeGlyph}>{row.prefix}</span>
                <span className={isEntry ? styles.treeEntry : styles.treeName}>
                  {row.name}
                </span>
                <span
                  className={styles.treeTag}
                  data-on={crosses ? "true" : "false"}
                  // Staggered by position so the tags sweep down the tree
                  // instead of flashing on at once.
                  style={{ transitionDelay: `${String(index * 32)}ms` }}
                  aria-hidden="true"
                >
                  &quot;use client&quot;
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/*
        The tree above is a picture. This line is the fact it illustrates, and
        it is live so that toggling announces the outcome rather than silently
        rearranging decoration.
      */}
      <figcaption className={styles.treeCaption} aria-live="polite">
        <span className={styles.treeCount}>{crossings}</span>
        <span className={styles.treeCountLabel}>
          of {COMPONENT_COUNT} components cross into your client bundle
        </span>
      </figcaption>
    </figure>
  );
}
