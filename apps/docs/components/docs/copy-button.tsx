"use client";

import { Button } from "@abbainitiative/ui";
import * as React from "react";

/**
 * Copies text to the clipboard and confirms it.
 *
 * The confirmation is rendered as the button's label rather than only as a
 * colour change, so the outcome is available to screen readers too.
 */
export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Clearing on unmount avoids setting state on a component that has gone.
  React.useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const copy = React.useCallback(() => {
    void navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      () => {
        // Clipboard access can be denied by permissions policy. Failing
        // silently is correct here: the code is still on screen to select.
      },
    );
  }, [value]);

  return (
    <Button size="sm" variant="ghost" onClick={copy} aria-live="polite">
      {copied ? "Copied" : label}
    </Button>
  );
}
