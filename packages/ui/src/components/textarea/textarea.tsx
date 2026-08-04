"use client";

import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./textarea.module.css";

export interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  /** Marks the field as failing validation. */
  invalid?: boolean;
  /** Resize affordance offered to the user. Defaults to `vertical`. */
  resize?: "none" | "vertical" | "both";
  /**
   * Grow the control to fit its content, using CSS `field-sizing`.
   *
   * Implemented in CSS rather than by measuring scrollHeight in an effect: no
   * layout thrash, and it behaves correctly on the very first paint.
   */
  autoSize?: boolean;
}

/**
 * A multi-line text field.
 *
 * Uncontrolled by default; pass `value` with `onChange` to control it.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { invalid = false, resize = "vertical", autoSize = false, className, ...rest },
    ref,
  ) {
    const resizeClass = {
      none: styles.resizeNone,
      vertical: styles.resizeVertical,
      both: styles.resizeBoth,
    }[resize];

    return (
      <textarea
        ref={ref}
        className={cn(
          styles.root,
          resizeClass,
          autoSize && styles.autoSize,
          className,
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";
