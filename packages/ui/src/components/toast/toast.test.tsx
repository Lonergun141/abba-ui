import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/button";
import { ToastProvider, useToast } from "./toast";

function Publisher({
  title = "Saved",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  const { toast } = useToast();
  return (
    <Button
      onClick={() => {
        toast({ title, description, action, tone: "success" });
      }}
    >
      Notify
    </Button>
  );
}

function renderWithProvider(ui: React.ReactNode) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("Toast", () => {
  it("shows nothing until a toast is published", () => {
    renderWithProvider(<Publisher />);
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("renders a published toast", async () => {
    renderWithProvider(<Publisher description="Your changes are live." />);
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));

    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes are live.")).toBeInTheDocument();
  });

  it("publishes into a live region so it is announced", async () => {
    renderWithProvider(<Publisher />);
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));

    await screen.findByText("Saved");
    // Radix appends the focus hotkey to the label, so the accessible name is
    // "Notifications (F8)" rather than the bare string passed in.
    expect(screen.getByRole("region", { name: /Notifications/ })).toBeInTheDocument();
  });

  it("stacks multiple toasts", async () => {
    renderWithProvider(<Publisher />);
    const button = screen.getByRole("button", { name: "Notify" });

    await userEvent.click(button);
    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.getAllByText("Saved")).toHaveLength(2);
    });
  });

  it("dismisses from the close button", async () => {
    renderWithProvider(<Publisher />);
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    await screen.findByText("Saved");

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => {
      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });
  });

  it("runs an action and labels it for assistive technology", async () => {
    const onClick = vi.fn();
    renderWithProvider(<Publisher action={{ label: "Undo", onClick }} />);

    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    await userEvent.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("throws a useful error when used outside a provider", () => {
    function Orphan() {
      useToast();
      return null;
    }

    // React logs the error boundary trace; silence it for this expected throw.
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Orphan />)).toThrow(/must be used within a <ToastProvider>/);
    spy.mockRestore();
  });

  it("has no axe violations with a toast on screen", async () => {
    const { container } = renderWithProvider(<Publisher description="Details" />);
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    await screen.findByText("Saved");
    await expect(container).toHaveNoAxeViolations();
  });
});
