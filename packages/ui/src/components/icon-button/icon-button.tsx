"use client";

import * as React from "react";

import { cn } from "../../utilities/cn";
import { Button, type ButtonProps } from "../button/button";
import styles from "./icon-button.module.css";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "leftIcon" | "rightIcon" | "fullWidth" | "children"
> {
  /** The icon to render. Hidden from assistive technology. */
  icon: React.ReactNode;
  /**
   * Accessible name for the control. Required — an icon alone conveys nothing
   * to a screen reader, so this is not optional the way a visual label is.
   */
  "aria-label": string;
  /** Use a fully rounded shape. */
  round?: boolean;
}

/**
 * A square button containing only an icon.
 *
 * Built on Button rather than duplicating its variant, size, focus and loading
 * behaviour.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, round = false, size = "md", className, ...rest }, ref) {
    return (
      <Button
        ref={ref}
        size={size}
        className={cn(styles.root, styles[size], round && styles.round, className)}
        {...rest}
      >
        <span aria-hidden="true">{icon}</span>
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
