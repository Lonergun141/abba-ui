import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./code.module.css";

export interface CodeProps extends React.ComponentPropsWithoutRef<"code"> {
  /**
   * `inline` sits within a sentence; `block` is a standalone snippet rendered
   * inside a `<pre>` so whitespace and line breaks are preserved.
   */
  variant?: "inline" | "block";
}

/**
 * Monospaced source text.
 *
 * Server-renderable: presentation only, no state.
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  { variant = "inline", className, children, ...rest },
  ref,
) {
  if (variant === "block") {
    return (
      <pre className={cn(styles.root, styles.block, className)}>
        <code ref={ref} {...rest}>
          {children}
        </code>
      </pre>
    );
  }

  return (
    <code ref={ref} className={cn(styles.root, styles.inline, className)} {...rest}>
      {children}
    </code>
  );
});

Code.displayName = "Code";
