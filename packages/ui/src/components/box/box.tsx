import * as React from "react";

import { cn } from "../../utilities/cn";
import {
  radiusVar,
  shadowVar,
  spaceVar,
  surfaceVar,
  type RadiusToken,
  type ShadowToken,
  type SpaceToken,
  type SurfaceToken,
} from "../../utilities/tokens";
import styles from "./box.module.css";

/**
 * Elements `Box` may render as.
 *
 * A closed union rather than a fully generic `as` prop: unconstrained
 * polymorphism forces a type assertion inside `forwardRef`, which costs the
 * component its inferred display name and makes every prop error unreadable.
 * This list covers the layout elements a design system actually needs.
 */
export type BoxElement =
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
  | "figure"
  | "form"
  | "fieldset";

export interface BoxProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Element to render. Defaults to `div`. */
  as?: BoxElement;
  /** Padding on all sides, from the spacing scale. */
  padding?: SpaceToken;
  /** Horizontal padding. Overrides `padding` on the inline axis. */
  paddingInline?: SpaceToken;
  /** Vertical padding. Overrides `padding` on the block axis. */
  paddingBlock?: SpaceToken;
  /** Background surface role. */
  background?: SurfaceToken;
  /** Corner radius token. */
  radius?: RadiusToken;
  /** Elevation token. */
  shadow?: ShadowToken;
  /** Draws a one-pixel border using the current border token. */
  bordered?: boolean;
}

/**
 * The lowest-level layout primitive: a styled element with token-bound spacing,
 * surface, radius and elevation. Renders on the server — it holds no state.
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(function Box(
  {
    as = "div",
    padding,
    paddingInline,
    paddingBlock,
    background,
    radius,
    shadow,
    bordered = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  // Narrowed to "div" for JSX type resolution only. Left as the BoxElement
  // union — or widened to React.ElementType, which is also a union — TypeScript
  // intersects the ref types of every member, and no concrete ref can satisfy
  // that intersection. The cast is sound for consumers: BoxProps already
  // declares div props, and `as` changes only the rendered tag name.
  const Component = as as "div";

  return (
    <Component
      ref={ref}
      className={cn(styles.root, bordered && styles.bordered, className)}
      style={{
        // Logical longhands rather than the `padding` shorthand: it makes the
        // axis-override precedence explicit in code instead of leaving it to
        // shorthand cascade order, and CSSOM implementations vary in whether
        // they accept `var()` inside a shorthand at all.
        paddingBlock: spaceVar(paddingBlock ?? padding),
        paddingInline: spaceVar(paddingInline ?? padding),
        background: surfaceVar(background),
        borderRadius: radiusVar(radius),
        boxShadow: shadowVar(shadow),
        ...style,
      }}
      {...rest}
    />
  );
});

Box.displayName = "Box";
