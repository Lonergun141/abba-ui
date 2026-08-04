import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./text.module.css";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextTone =
  | "default"
  | "muted"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";
export type TextLeading = "tight" | "snug" | "normal" | "relaxed";

export interface TextProps extends React.ComponentPropsWithoutRef<"p"> {
  /** Element to render. Defaults to `p`. */
  as?: "p" | "span" | "div" | "strong" | "em" | "small" | "dd" | "dt" | "li";
  /** Type scale step. Defaults to `md`. */
  size?: TextSize;
  /** Font weight. Defaults to `regular`. */
  weight?: TextWeight;
  /** Semantic colour role. Defaults to `default`. */
  tone?: TextTone;
  /** Line height. Defaults to `normal`. */
  leading?: TextLeading;
  /** Text alignment. */
  align?: "start" | "center" | "end";
  /** Truncate to a single line with an ellipsis. */
  truncate?: boolean;
}

/**
 * Body copy at a token-bound size, weight and tone.
 *
 * Server-renderable: presentation only, no state.
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(function Text(
  {
    as = "p",
    size = "md",
    weight = "regular",
    tone = "default",
    leading = "normal",
    align,
    truncate = false,
    className,
    ...rest
  },
  ref,
) {
  const Component = as as "p";

  return (
    <Component
      ref={ref}
      className={cn(
        styles.root,
        styles[size],
        styles[weight],
        styles[tone],
        styles[leading],
        align && styles[align],
        truncate && styles.truncate,
        className,
      )}
      {...rest}
    />
  );
});

Text.displayName = "Text";
