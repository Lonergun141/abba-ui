import type * as React from "react";

import styles from "./docs.module.css";

/** Lays out several small examples side by side, reflowing on narrow screens. */
export function ExampleGrid({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <div className={styles.exampleGrid}>{children}</div>;
}
