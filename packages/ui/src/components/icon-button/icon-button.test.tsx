import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { IconButton } from "./icon-button";

const Icon = () => <span data-testid="icon">x</span>;

describe("IconButton", () => {
  it("takes its accessible name from aria-label", () => {
    render(<IconButton aria-label="Close panel" icon={<Icon />} />);
    expect(screen.getByRole("button", { name: "Close panel" })).toBeInTheDocument();
  });

  it("hides the icon from assistive technology", () => {
    render(<IconButton aria-label="Close" icon={<Icon />} />);
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Close" icon={<Icon />} onClick={onClick} />);

    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("inherits Button's variants and sizes", () => {
    render(
      <IconButton aria-label="Delete" icon={<Icon />} variant="danger" size="lg" />,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("danger");
    expect(button.className).toContain("lg");
  });

  it("inherits the disabled and loading states", () => {
    const { rerender } = render(
      <IconButton aria-label="Save" icon={<Icon />} disabled />,
    );
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<IconButton aria-label="Save" icon={<Icon />} loading />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("applies the round shape when asked", () => {
    render(<IconButton aria-label="Close" icon={<Icon />} round />);
    expect(screen.getByRole("button").className).toContain("round");
  });

  it("forwards a ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton aria-label="Close" icon={<Icon />} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<IconButton aria-label="Close" icon={<Icon />} />);
    await expect(container).toHaveNoAxeViolations();
  });
});
