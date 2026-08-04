import * as React from "react";

import { cn } from "../../utilities/cn";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import styles from "./label.module.css";

export interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
  /** Marks the associated control as required. */
  required?: boolean;
  /** Dims the label to match a disabled control. */
  disabled?: boolean;
  /**
   * Text announced in place of the asterisk.
   *
   * The asterisk alone is meaningless to a screen reader, so the word is
   * provided visually-hidden alongside it.
   */
  requiredLabel?: string;
}

/**
 * A caption for a form control.
 *
 * Renders a real `<label>`, so clicking it focuses the associated control
 * through the platform rather than through a click handler.
 *
 * Server-renderable: presentation only, no state.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  {
    required = false,
    disabled = false,
    requiredLabel = "required",
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(styles.root, disabled && styles.disabled, className)}
      {...rest}
    >
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className={styles.required}>
            *
          </span>
          <VisuallyHidden>{requiredLabel}</VisuallyHidden>
        </>
      ) : null}
    </label>
  );
});

Label.displayName = "Label";
