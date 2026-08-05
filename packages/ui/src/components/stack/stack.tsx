import * as React from "react";

import { Flex, type FlexOwnProps } from "../../internal/flex";

export interface StackProps
  extends FlexOwnProps, React.ComponentPropsWithoutRef<"div"> {}

/**
 * Stacks children vertically with token-based spacing.
 *
 * Server-renderable: layout only, no state.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  function Stack(props, ref) {
    return <Flex ref={ref} direction="column" {...props} />;
  },
);

Stack.displayName = "Stack";
