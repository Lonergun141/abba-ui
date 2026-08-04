import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Example({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Confirm name" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed until the trigger is activated", async () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("names and describes itself from the title and description", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Delete project");
    expect(dialog).toHaveAccessibleDescription("This action cannot be undone.");
  });

  it("hides the rest of the page from assistive technology while open", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });

    await userEvent.click(trigger);
    await screen.findByRole("dialog");

    // Radix marks sibling content aria-hidden rather than relying on
    // aria-modal, whose screen-reader support has never been consistent. The
    // trigger sits outside the dialog, so it must now be hidden.
    await waitFor(() => {
      expect(trigger.closest("[aria-hidden='true']")).not.toBeNull();
    });
  });

  it("moves focus into the dialog when it opens", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it("traps Tab within the dialog", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");

    // Cycle past the end of the focusable content; focus must stay inside.
    for (let i = 0; i < 8; i += 1) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("closes on Escape", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("returns focus to the trigger after closing", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });

    await userEvent.click(trigger);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("closes from a DialogClose child", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("reports open-state changes", async () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders the built-in close button, and can omit it", async () => {
    const { unmount } = render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await screen.findByRole("button", { name: "Close dialog" })).toBeInTheDocument();
    unmount();

    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No close button</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole("button", { name: "Close dialog" })).not.toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => { setOpen(true); }}>
            External open
          </button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Controlled</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    render(<Controlled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "External open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");
    await expect(dialog).toHaveNoAxeViolations();
  });
});
