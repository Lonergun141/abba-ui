import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "../button/button";
import { IconButton } from "../icon-button/icon-button";
import { ButtonGroup } from "./button-group";

describe("ButtonGroup", () => {
  it("exposes itself as a named group", () => {
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group", { name: "Text alignment" })).toBeInTheDocument();
  });

  it("joins buttons by default and spaces them when detached", () => {
    const { rerender } = render(
      <ButtonGroup aria-label="Actions" data-testid="group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByTestId("group").className).toContain("attached");

    rerender(
      <ButtonGroup aria-label="Actions" attached={false} data-testid="group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByTestId("group").className).toContain("spaced");
  });

  it("supports a vertical axis", () => {
    render(
      <ButtonGroup aria-label="Actions" orientation="vertical" data-testid="group">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByTestId("group").className).toContain("vertical");
  });

  it("keeps every child individually reachable by keyboard", async () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  });

  it("has no axe violations, including with icon buttons", async () => {
    const { container } = render(
      <ButtonGroup aria-label="Formatting">
        <IconButton aria-label="Bold" icon={<span>B</span>} />
        <IconButton aria-label="Italic" icon={<span>I</span>} />
      </ButtonGroup>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
