import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Example({ onSelect }: { onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onSelect}>
          Edit
          <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem disabled>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("is closed until the trigger is activated", async () => {
    render(<Example />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("marks the trigger as expanded while open", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("opens from the keyboard and focuses the first item", async () => {
    render(<Example />);
    screen.getByRole("button", { name: "Actions" }).focus();
    await userEvent.keyboard("{Enter}");

    await screen.findByRole("menu");
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: /Edit/ })).toHaveFocus();
    });
  });

  it("moves focus between items with the arrow keys", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");

    // Opening by pointer leaves focus on the menu itself, so the first
    // ArrowDown highlights the first item and the second moves off it.
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    });
  });

  it("skips disabled items during keyboard navigation", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");

    // Edit, Duplicate, then Archive is skipped because it is disabled.
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    });
  });

  it("calls onSelect when an item is chosen", async () => {
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: /Edit/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Actions" });

    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("hides the keyboard shortcut from assistive technology", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");

    // The shortcut text is present visually but excluded from the item's name.
    expect(screen.getByText("Ctrl E")).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes disabled items as disabled", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");

    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveAttribute(
      "data-disabled",
    );
  });

  it("has no axe violations when open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    const menu = await screen.findByRole("menu");
    await expect(menu).toHaveNoAxeViolations();
  });
});
