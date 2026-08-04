import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tabs, TabsList, TabsPanel, TabsTrigger } from "./tabs";

function Example({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <Tabs defaultValue="overview" onValueChange={onValueChange}>
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsPanel value="overview">Overview content</TabsPanel>
      <TabsPanel value="activity">Activity content</TabsPanel>
      <TabsPanel value="settings">Settings content</TabsPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the default panel only", () => {
    render(<Example />);
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.queryByText("Activity content")).not.toBeInTheDocument();
  });

  it("marks the active tab as selected", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("switches panels on click", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Activity" }));

    expect(await screen.findByText("Activity content")).toBeInTheDocument();
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
  });

  it("moves between tabs with the arrow keys", async () => {
    render(<Example />);
    screen.getByRole("tab", { name: "Overview" }).focus();

    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Activity" })).toHaveFocus();
    });
  });

  it("puts only the active tab in the tab sequence (roving tabindex)", async () => {
    render(<Example />);

    // Asserted behaviourally rather than by reading tabindex: what matters is
    // that Tab reaches the tab list once and lands on the active tab, then
    // leaves for the panel instead of walking through every tab.
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Activity" })).not.toHaveFocus();
  });

  it("associates each tab with its panel", () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");

    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("names the tab list", () => {
    render(<Example />);
    expect(screen.getByRole("tablist")).toHaveAccessibleName("Project sections");
  });

  it("does not activate a disabled tab", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Settings" }));
    expect(screen.queryByText("Settings content")).not.toBeInTheDocument();
  });

  it("reports value changes", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("tab", { name: "Activity" }));
    expect(onValueChange).toHaveBeenCalledWith("activity");
  });

  it("applies the variant from the root to the list", () => {
    const { container } = render(
      <Tabs defaultValue="a" variant="enclosed">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsPanel value="a">A content</TabsPanel>
      </Tabs>,
    );
    expect(container.querySelector('[role="tablist"]')?.className).toContain("enclosed");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    await expect(container).toHaveNoAxeViolations();
  });
});
