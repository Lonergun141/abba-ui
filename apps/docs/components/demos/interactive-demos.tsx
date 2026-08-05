"use client";

import {
  Alert,
  Button,
  Inline,
  Stack,
  Text,
  ToastProvider,
  useToast,
} from "@abbainitiative/ui";
import * as React from "react";

/**
 * The two demos that genuinely need the client.
 *
 * Everything else lives in ./static-demos and renders on the server. These two
 * are here because one holds local state and the other calls a hook — neither
 * can be expressed declaratively, so the boundary is real rather than a
 * precaution.
 */

function DismissibleAlertDemo(): React.JSX.Element {
  const [visible, setVisible] = React.useState(true);

  return (
    <Stack gap={3} fullWidth>
      {visible ? (
        <Alert
          tone="info"
          title="Tip"
          onDismiss={() => {
            setVisible(false);
          }}
        >
          You can dismiss this message.
        </Alert>
      ) : (
        <Text tone="muted" size="sm">
          Dismissed.
        </Text>
      )}

      {!visible && (
        <Inline>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setVisible(true);
            }}
          >
            Bring it back
          </Button>
        </Inline>
      )}
    </Stack>
  );
}

/** The button half of the toast demo — must sit below the provider to use the hook. */
function ToastTrigger(): React.JSX.Element {
  const { toast } = useToast();

  return (
    <Inline gap={2}>
      <Button
        onClick={() => {
          toast({
            title: "Changes saved",
            description: "Your profile is up to date.",
            tone: "success",
            action: {
              label: "Undo",
              onClick: () => {
                toast({ title: "Reverted", tone: "info" });
              },
            },
          });
        }}
      >
        Save
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Upload failed",
            description: "The file exceeds the 10 MB limit.",
            tone: "danger",
          });
        }}
      >
        Trigger an error
      </Button>
    </Inline>
  );
}

function ToastDemo(): React.JSX.Element {
  // A provider scoped to this demo rather than mounted in the root layout: the
  // viewport is fixed-position, and one per page would be indistinguishable
  // from the real thing while making the boundary less obvious than it is.
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}

const interactive: Record<string, () => React.JSX.Element> = {
  "alert-dismissible": DismissibleAlertDemo,
  "toast-basic": ToastDemo,
};

/**
 * Resolves a demo id to its interactive implementation.
 *
 * Returns null for an unknown id rather than throwing: a missing demo should
 * leave a gap in the page, not take the whole route down.
 */
export function InteractiveDemo({ id }: { id: string }): React.JSX.Element | null {
  const Demo = interactive[id];
  return Demo ? <Demo /> : null;
}
