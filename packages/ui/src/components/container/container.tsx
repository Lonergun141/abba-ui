import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./container.module.css";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Element to render. Defaults to `div`. */
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
  /** Maximum inline size. Defaults to `lg`. */
  size?: ContainerSize;
  /** Adds responsive inline padding so content never touches the viewport edge. */
  padded?: boolean;
}

/**
 * Centres content and caps its measure.
 *
 * Server-renderable: layout only, no state.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    { as = "div", size = "lg", padded = true, className, ...rest },
    ref,
  ) {
    const Component = as as "div";

    return (
      <Component
        ref={ref}
        className={cn(styles.root, styles[size], padded && styles.padded, className)}
        {...rest}
      />
    );
  },
);

Container.displayName = "Container";
