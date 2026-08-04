import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("type", "text");
  });

  it("honours an explicit type", () => {
    render(<Input aria-label="Email" type="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("works uncontrolled", async () => {
    render(<Input aria-label="Name" defaultValue="Ada" />);
    const input = screen.getByLabelText<HTMLInputElement>("Name");

    await userEvent.type(input, "!");
    expect(input.value).toBe("Ada!");
  });

  it("works controlled", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" value="fixed" onChange={onChange} />);
    const input = screen.getByLabelText<HTMLInputElement>("Name");

    await userEvent.type(input, "x");
    expect(onChange).toHaveBeenCalled();
    // The parent owns the value, so it does not move on its own.
    expect(input.value).toBe("fixed");
  });

  it.each(["sm", "md", "lg"] as const)("applies the %s size class", (size) => {
    render(<Input aria-label="Name" size={size} />);
    expect(screen.getByLabelText("Name").className).toContain(size);
  });

  it("exposes the invalid state to assistive technology", () => {
    render(<Input aria-label="Name" invalid />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
  });

  it("omits aria-invalid when valid", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("supports the disabled state", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" disabled onChange={onChange} />);
    const input = screen.getByLabelText("Name");

    expect(input).toBeDisabled();
    await userEvent.type(input, "x");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards a ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input aria-label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards a ref even when wrapped by an affix", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input aria-label="Amount" prefix="₱" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("hides decorative affixes from assistive technology", () => {
    render(<Input aria-label="Amount" prefix="₱" suffix=".00" />);
    expect(screen.getByText("₱")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(".00")).toHaveAttribute("aria-hidden", "true");
  });

  it("passes native attributes through", () => {
    render(
      <Input aria-label="Name" placeholder="Ada Lovelace" maxLength={40} required />,
    );
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("placeholder", "Ada Lovelace");
    expect(input).toHaveAttribute("maxlength", "40");
    expect(input).toBeRequired();
  });

  it("merges consumer class names", () => {
    render(<Input aria-label="Name" className="custom" />);
    expect(screen.getByLabelText("Name")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Input aria-label="Name" />);
    await expect(container).toHaveNoAxeViolations();
  });
});
