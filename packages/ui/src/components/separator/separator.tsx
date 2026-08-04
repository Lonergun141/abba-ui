import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./separator.module.css";

export interface SeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Axis the separator runs along. Defaults to `horizontal`. */
  orientation?: "horizontal" | "vertical";
  /**
   * Whether the rule is purely visual.
   *
   * Defaults to `true`. A decorative separator is removed from the
   * accessibility tree; screen readers already convey structure through
   * headings and landmarks, so most rules are noise when announced. Set to
   * `false` only when the separator carries real meaning, such as dividing
   * groups within a menu.
   */
  decorative?: boolean;
}

/**
 * A visual or semantic dividing rule.
 *
 * Server-renderable: presentation only, no state.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { orientation = "horizontal", decorative = true, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[orientation], className)}
        role={decorative ? "none" : "separator"}
        aria-orientation={
          !decorative && orientation === "vertical" ? "vertical" : undefined
        }
        {...rest}
      />
    );
  },
);

Separator.displayName = "Separator";
