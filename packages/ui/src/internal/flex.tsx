import * as React from "react";

import { cn } from "../utilities/cn";
import { spaceVar, type SpaceToken } from "../utilities/tokens";
import styles from "./flex.module.css";

/**
 * Internal flex base shared by Stack and Inline.
 *
 * Not exported from the package. Stack and Inline differ only in axis and
 * wrapping default, so the layout logic lives here once rather than being
 * copied into two components that would then drift apart.
 */

export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type FlexElement =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "ul"
  | "ol"
  | "li"
  | "form"
  | "fieldset";

const ALIGN: Record<FlexAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const JUSTIFY: Record<FlexJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export interface FlexOwnProps {
  /** Element to render. Defaults to `div`. */
  as?: FlexElement;
  /** Space between children, from the spacing scale. */
  gap?: SpaceToken;
  /** Cross-axis alignment. */
  align?: FlexAlign;
  /** Main-axis distribution. */
  justify?: FlexJustify;
  /** Allow children to wrap onto additional lines. */
  wrap?: boolean;
  /** Stretch to fill the container's inline size. */
  fullWidth?: boolean;
}

export interface FlexProps
  extends FlexOwnProps,
    React.ComponentPropsWithoutRef<"div"> {
  direction: "row" | "column";
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    as = "div",
    direction,
    gap,
    align,
    justify,
    wrap = false,
    fullWidth = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  // See the note in Box: the element union has to be narrowed for JSX to
  // resolve a single ref signature.
  const Component = as as "div";

  return (
    <Component
      ref={ref}
      className={cn(styles.root, fullWidth && styles.fullWidth, className)}
      style={{
        flexDirection: direction,
        gap: spaceVar(gap),
        alignItems: align && ALIGN[align],
        justifyContent: justify && JUSTIFY[justify],
        flexWrap: wrap ? "wrap" : undefined,
        ...style,
      }}
      {...rest}
    />
  );
});

Flex.displayName = "Flex";
