import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./button-group.module.css";

export interface ButtonGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Layout axis. Defaults to `horizontal`. */
  orientation?: "horizontal" | "vertical";
  /**
   * Join the buttons into a single visual control by collapsing the radii and
   * borders between them. Defaults to `true`.
   */
  attached?: boolean;
  /**
   * Accessible name for the group.
   *
   * The group is exposed with `role="group"`, which is announced; without a
   * name that announcement is meaningless, so provide one.
   */
  "aria-label"?: string;
}

/**
 * Groups related buttons into one control.
 *
 * Server-renderable: layout only. The buttons inside carry their own client
 * boundaries.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    { orientation = "horizontal", attached = true, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          styles.root,
          orientation === "vertical" && styles.vertical,
          attached ? styles.attached : styles.spaced,
          className,
        )}
        {...rest}
      />
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
