import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./form-message.module.css";

export type FormMessageTone = "description" | "error" | "success";

export interface FormMessageProps extends React.ComponentPropsWithoutRef<"p"> {
  /** Meaning of the message. Defaults to `description`. */
  tone?: FormMessageTone;
  /**
   * Announce the message as it appears.
   *
   * Defaults to `true` for the `error` tone: a validation failure that is only
   * shown visually is invisible to a screen-reader user who has already moved
   * past the field.
   */
  live?: boolean;
}

/**
 * Helper, error or confirmation text belonging to a form control.
 *
 * Usually rendered by FormField, which also wires the `aria-describedby`
 * relationship. Exported separately for forms built by hand.
 *
 * Server-renderable: presentation only, no state.
 */
export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage(
    { tone = "description", live, className, children, ...rest },
    ref,
  ) {
    const isLive = live ?? tone === "error";

    return (
      <p
        ref={ref}
        className={cn(styles.root, styles[tone], className)}
        role={tone === "error" ? "alert" : undefined}
        aria-live={isLive ? "polite" : undefined}
        {...rest}
      >
        {tone === "error" ? (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5M12 16.2v.2" />
          </svg>
        ) : null}
        {children}
      </p>
    );
  },
);

FormMessage.displayName = "FormMessage";
