import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./heading.module.css";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "sm" | "md" | "lg" | "xl" | "display";

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "md",
  5: "sm",
  6: "sm",
};

export interface HeadingProps extends React.ComponentPropsWithoutRef<"h2"> {
  /**
   * Heading rank, rendered as the matching `h1`–`h6` element.
   *
   * Rank drives document outline, so choose it for the page structure and use
   * `size` when the visual weight needs to differ. Never pick a rank purely to
   * get a font size.
   */
  level?: HeadingLevel;
  /** Visual size. Defaults to a sensible size for the given `level`. */
  size?: HeadingSize;
  /** Semantic colour role. */
  tone?: "default" | "muted" | "primary";
}

/**
 * A section heading.
 *
 * Server-renderable: presentation only, no state.
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 2, size, tone = "default", className, ...rest }, ref) {
    const Component = `h${String(level)}` as "h2";
    const resolvedSize = size ?? DEFAULT_SIZE[level];

    return (
      <Component
        ref={ref}
        className={cn(styles.root, styles[resolvedSize], styles[tone], className)}
        {...rest}
      />
    );
  },
);

Heading.displayName = "Heading";
