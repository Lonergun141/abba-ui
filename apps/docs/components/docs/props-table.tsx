import { VisuallyHidden } from "@abbainitiative/ui";
import type * as React from "react";

import type { PropDef } from "@/content/types";
import styles from "./docs.module.css";

/**
 * Renders a component's public props.
 *
 * A real `<table>` with a `<caption>` and header scopes, rather than a grid of
 * divs: screen readers can then navigate it cell by cell and announce which
 * column each value belongs to.
 */
export function PropsTable({
  props,
  componentName,
}: {
  props: PropDef[];
  componentName: string;
}): React.JSX.Element {
  if (props.length === 0) {
    return (
      <p>
        {componentName} takes no props of its own beyond the native attributes of the
        element it renders.
      </p>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption>
          {componentName} props. All native attributes of the underlying element are
          also accepted and forwarded.
        </caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <th scope="row" className={styles.propName}>
                {prop.name}
                {prop.required ? (
                  <>
                    <span className={styles.requiredMark} aria-hidden="true">
                      {" *"}
                    </span>
                    <VisuallyHidden> (required)</VisuallyHidden>
                  </>
                ) : null}
              </th>
              <td>
                <code className={styles.propType}>{prop.type}</code>
              </td>
              <td>
                {prop.defaultValue ? (
                  <code className={styles.propDefault}>{prop.defaultValue}</code>
                ) : (
                  <span aria-hidden="true">—</span>
                )}
              </td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
