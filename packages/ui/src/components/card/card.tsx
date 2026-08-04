import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./card.module.css";

export type CardVariant = "outlined" | "elevated" | "filled";

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Element to render. Defaults to `div`. */
  as?: "div" | "article" | "section" | "li";
  /** Visual treatment. Defaults to `outlined`. */
  variant?: CardVariant;
  /**
   * Adds hover and focus affordances for cards that lead somewhere.
   *
   * This styles the card only. Put a real link or button inside for the
   * interaction — a clickable `div` is not reachable by keyboard, and the
   * focus ring here is driven by `:focus-within` on that inner control.
   */
  interactive?: boolean;
}

/**
 * A grouped surface for related content.
 *
 * Server-renderable: presentation only, no state.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { as = "div", variant = "outlined", interactive = false, className, ...rest },
  ref,
) {
  const Component = as as "div";

  return (
    <Component
      ref={ref}
      className={cn(
        styles.root,
        styles[variant],
        interactive && styles.interactive,
        className,
      )}
      {...rest}
    />
  );
});

Card.displayName = "Card";

export type CardHeaderProps = React.ComponentPropsWithoutRef<"div">;

/** Title area of a Card. */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.header, className)} {...rest} />;
  },
);

CardHeader.displayName = "CardHeader";

export type CardBodyProps = React.ComponentPropsWithoutRef<"div">;

/** Main content area of a Card. */
export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.body, className)} {...rest} />;
  },
);

CardBody.displayName = "CardBody";

export interface CardFooterProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Draws a rule above the footer. */
  divided?: boolean;
}

/** Action area of a Card. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ divided = false, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(styles.footer, divided && styles.divided, className)}
        {...rest}
      />
    );
  },
);

CardFooter.displayName = "CardFooter";
