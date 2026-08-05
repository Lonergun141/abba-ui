import type * as React from "react";

import { CopyButton } from "./copy-button";
import styles from "./docs.module.css";

/**
 * A copyable code sample.
 *
 * A Server Component — only the copy button crosses into the client. Syntax
 * highlighting is deliberately absent: it would mean shipping a highlighter to
 * every page for decoration, and unhighlighted code is still perfectly legible.
 */
export function CodeBlock({
  code,
  language = "tsx",
  copyLabel,
}: {
  code: string;
  language?: string;
  copyLabel?: string;
}): React.JSX.Element {
  return (
    <div className={styles.codeBlock}>
      {/*
        role="region" plus tabIndex makes the sample a focusable scroll
        container. Long lines scroll horizontally, and a region a mouse can
        scroll but a keyboard cannot is a WCAG 2.1.1 failure.
      */}
      <pre
        className={styles.pre}
        tabIndex={0}
        role="region"
        aria-label={`${language} code sample`}
      >
        <code>{code}</code>
      </pre>
      <div className={styles.copyButton}>
        <CopyButton value={code} label={copyLabel} />
      </div>
    </div>
  );
}
