import * as React from "react";

import { cn } from "../../utilities/cn";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import styles from "./badge.module.css";

export type BadgeTone =
  "neutral" | "primary" | "accent" | "success" | "warning" | "danger" | "info";
export type BadgeVariant = "subtle" | "solid" | "outline";

export interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Semantic colour role. Defaults to `neutral`. */
  tone?: BadgeTone;
  /** Visual treatment. Defaults to `subtle`. */
  variant?: BadgeVariant;
  /** Size. Defaults to `md`. */
  size?: "sm" | "md" | "lg";
  /** Shows a leading status dot. */
  dot?: boolean;
  /**
   * Text announced before the badge label.
   *
   * Colour alone carries the meaning of a badge, and colour is not available
   * to screen readers. Pass e.g. `"Status:"` where the tone is the message.
   */
  srLabel?: string;
}

/**
 * A short status or category marker.
 *
 * Server-renderable: presentation only, no state.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    tone = "neutral",
    variant = "subtle",
    size = "md",
    dot = false,
    srLabel,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        styles.root,
        styles[variant],
        styles[tone],
        styles[size],
        className,
      )}
      {...rest}
    >
      {srLabel ? <VisuallyHidden>{srLabel}</VisuallyHidden> : null}
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
