import type * as React from "react";

import { InteractiveDemo } from "./interactive-demos";
import { staticDemos } from "./static-demos";

/**
 * Resolves an example id to its rendered demo.
 *
 * Server-rendered demos are tried first, so the client bundle only grows for
 * the handful of examples that genuinely need it.
 */
export function Demo({ id }: { id: string }): React.ReactNode {
  return staticDemos[id] ?? <InteractiveDemo id={id} />;
}
