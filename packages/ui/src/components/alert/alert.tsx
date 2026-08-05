"use client";

import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./alert.module.css";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "title"
> {
  /** Semantic role of the message. Defaults to `info`. */
  tone?: AlertTone;
  /**
   * Short headline.
   *
   * `title` is omitted from the inherited div props above: the HTML attribute
   * of that name is a `string` tooltip, and a heading here is rich content.
   */
  title?: React.ReactNode;
  /** Replaces the built-in tone icon. */
  icon?: React.ReactNode;
  /** Renders a close button and calls `onDismiss` when activated. */
  onDismiss?: () => void;
  /** Accessible name for the close button. */
  dismissLabel?: string;
}

const ICON_PATHS: Record<AlertTone, React.ReactNode> = {
  info: <path d="M12 16v-5M12 8.2v.2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
  success: <path d="m8 12.5 2.8 2.8L16 9.4M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
  warning: (
    <path d="M12 9.5v4M12 17.3v.2M10.3 4l-7.6 13a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3l-7.6-13a2 2 0 0 0-3.4 0Z" />
  ),
  danger: <path d="M12 8v5M12 16.3v.2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
};

/**
 * A prominent inline message.
 *
 * `danger` and `warning` use `role="alert"`, which interrupts a screen reader
 * immediately; `info` and `success` use `role="status"`, which waits for a
 * pause. Getting this backwards either buries an error or hijacks the user
 * mid-sentence for something trivial.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = "info",
    title,
    icon,
    onDismiss,
    dismissLabel = "Dismiss",
    className,
    children,
    ...rest
  },
  ref,
) {
  const isUrgent = tone === "danger" || tone === "warning";

  return (
    <div
      ref={ref}
      className={cn(styles.root, styles[tone], className)}
      role={isUrgent ? "alert" : "status"}
      aria-live={isUrgent ? "assertive" : "polite"}
      {...rest}
    >
      {icon ?? (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          {ICON_PATHS[tone]}
        </svg>
      )}

      <div className={styles.content}>
        {title ? <p className={styles.title}>{title}</p> : null}
        {children ? <div className={styles.description}>{children}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});

Alert.displayName = "Alert";
