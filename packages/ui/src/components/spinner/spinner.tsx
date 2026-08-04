import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./spinner.module.css";

export interface SpinnerProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Diameter of the spinner. Defaults to `md`. */
  size?: "sm" | "md" | "lg";
  /**
   * Accessible label announced to screen readers.
   *
   * Pass `null` when the spinner sits inside a control that already announces
   * its busy state — a labelled spinner inside an `aria-busy` button would be
   * read twice.
   */
  label?: string | null;
}

/**
 * An indeterminate loading indicator. Inherits `currentColor`, so it adopts the
 * text colour of whatever it sits inside.
 *
 * Server-renderable: it is a CSS animation with no state or effects.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.root, styles[size], className)}
      role={label === null ? "presentation" : "status"}
      aria-label={label ?? undefined}
      aria-hidden={label === null ? true : undefined}
      {...rest}
    />
  );
});

Spinner.displayName = "Spinner";
