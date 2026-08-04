import * as React from "react";

import { cn } from "../../utilities/cn";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import styles from "./link.module.css";

export interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  /** Underline behaviour. Defaults to `hover`. */
  underline?: "always" | "hover" | "none";
  /**
   * Marks the link as leaving the current site.
   *
   * Sets `target="_blank"` with `rel="noopener noreferrer"`, shows an arrow
   * glyph, and appends visually-hidden text so the new-window behaviour is
   * announced rather than only shown.
   */
  external?: boolean;
  /** Text announced after an external link's label. */
  externalLabel?: string;
}

/**
 * A navigational hyperlink.
 *
 * Renders a plain `<a>`, so it composes with any router: wrap it with Next's
 * `Link` using `asChild`-style composition, or pass `href` directly.
 *
 * Server-renderable: it holds no state.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    underline = "hover",
    external = false,
    externalLabel = "(opens in a new tab)",
    className,
    children,
    target,
    rel,
    ...rest
  },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(styles.root, styles[underline], className)}
      target={target ?? (external ? "_blank" : undefined)}
      // noopener prevents the opened page reaching back through window.opener.
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      {...rest}
    >
      {children}
      {external ? (
        <>
          <svg
            className={styles.externalIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
          <VisuallyHidden>{externalLabel}</VisuallyHidden>
        </>
      ) : null}
    </a>
  );
});

Link.displayName = "Link";
