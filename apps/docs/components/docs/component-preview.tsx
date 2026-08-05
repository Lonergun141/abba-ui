import type * as React from "react";

import { CodeBlock } from "./code-block";
import styles from "./docs.module.css";

/**
 * A live example paired with its source.
 *
 * The rendered demo is passed in as `children`, so this stays a Server
 * Component and only the demo itself decides whether it needs the client.
 */
export function ComponentPreview({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section className={styles.preview}>
      <div className={styles.previewHeader}>
        <div>
          <h3 className={styles.previewTitle}>{title}</h3>
          {description ? (
            <p className={styles.previewDescription}>{description}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.previewStage}>{children}</div>

      <div className={styles.previewCode}>
        <CodeBlock code={code} />
      </div>
    </section>
  );
}
