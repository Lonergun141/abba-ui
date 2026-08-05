import type * as React from "react";

import styles from "./docs.module.css";

/**
 * The accessibility guarantees a component makes.
 *
 * Given its own visual treatment because these notes are the part of a design
 * system most often skimmed, and they are the part that matters most.
 */
export function AccessibilitySection({
  notes,
}: {
  notes: string[];
}): React.JSX.Element {
  return (
    <section className={styles.a11y} aria-labelledby="accessibility-notes">
      <h2 className={styles.a11yTitle} id="accessibility-notes">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.3 2.4 2.4 4.6-4.9" />
        </svg>
        Accessibility
      </h2>
      <ul className={styles.a11yList}>
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}
