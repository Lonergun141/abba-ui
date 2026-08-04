import * as React from "react";

import { cn } from "../../utilities/cn";
import { spaceVar, type SpaceToken } from "../../utilities/tokens";
import styles from "./grid.module.css";

export interface GridProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Element to render. Defaults to `div`. */
  as?: "div" | "section" | "ul" | "ol";
  /**
   * Fixed number of equal columns.
   *
   * Ignored when `minItemWidth` is set, which produces a responsive track list
   * instead and needs no media queries.
   */
  columns?: number;
  /** Space between grid items. */
  gap?: SpaceToken;
  /**
   * Minimum width of each item, e.g. `"16rem"`. Produces a grid that reflows by
   * itself as the container narrows.
   */
  minItemWidth?: string;
}

/**
 * Two-dimensional layout primitive.
 *
 * Server-renderable: layout only, no state.
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(function Grid(
  { as = "div", columns, gap, minItemWidth, className, style, ...rest },
  ref,
) {
  const Component = as as "div";

  const templateColumns = minItemWidth
    ? `repeat(auto-fill, minmax(min(${minItemWidth}, 100%), 1fr))`
    : columns
      ? `repeat(${String(columns)}, minmax(0, 1fr))`
      : undefined;

  return (
    <Component
      ref={ref}
      className={cn(styles.root, className)}
      style={{
        gridTemplateColumns: templateColumns,
        gap: spaceVar(gap),
        ...style,
      }}
      {...rest}
    />
  );
});

Grid.displayName = "Grid";
