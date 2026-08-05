import * as React from "react";

import { Flex, type FlexOwnProps } from "../../internal/flex";

export interface InlineProps
  extends FlexOwnProps, React.ComponentPropsWithoutRef<"div"> {}

/**
 * Arranges children horizontally with token-based spacing.
 *
 * Wraps by default — a horizontal row that cannot wrap is the usual cause of
 * overflow on narrow viewports. Pass `wrap={false}` to opt out.
 *
 * Server-renderable: layout only, no state.
 */
export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(function Inline(
  { wrap = true, align = "center", ...rest },
  ref,
) {
  return <Flex ref={ref} direction="row" wrap={wrap} align={align} {...rest} />;
});

Inline.displayName = "Inline";
