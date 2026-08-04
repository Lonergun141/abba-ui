import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./visually-hidden.module.css";

export interface VisuallyHiddenProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Element to render. Defaults to `span`. */
  as?: "span" | "div" | "label" | "legend";
}

/**
 * Content available to screen readers but not shown on screen.
 *
 * Use for labels that are obvious visually but absent semantically — an icon
 * button's purpose, or a table caption implied by surrounding layout.
 *
 * Server-renderable: presentation only, no state.
 */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ as = "span", className, ...rest }, ref) {
    const Component = as as "span";
    return <Component ref={ref} className={cn(styles.root, className)} {...rest} />;
  },
);

VisuallyHidden.displayName = "VisuallyHidden";
