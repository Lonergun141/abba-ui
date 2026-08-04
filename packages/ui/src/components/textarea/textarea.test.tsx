import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByLabelText("Notes").tagName).toBe("TEXTAREA");
  });

  it("works uncontrolled", async () => {
    render(<Textarea aria-label="Notes" defaultValue="Hello" />);
    const field = screen.getByLabelText<HTMLTextAreaElement>("Notes");

    await userEvent.type(field, "!");
    expect(field.value).toBe("Hello!");
  });

  it("works controlled", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="Notes" value="fixed" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Notes"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("exposes the invalid state", () => {
    render(<Textarea aria-label="Notes" invalid />);
    expect(screen.getByLabelText("Notes")).toHaveAttribute("aria-invalid", "true");
  });

  it("supports the disabled state", () => {
    render(<Textarea aria-label="Notes" disabled />);
    expect(screen.getByLabelText("Notes")).toBeDisabled();
  });

  it.each(["none", "vertical", "both"] as const)(
    "applies the %s resize class",
    (resize) => {
      render(<Textarea aria-label="Notes" resize={resize} />);
      expect(screen.getByLabelText("Notes").className).toContain("resize");
    },
  );

  it("adds the auto-size class when asked", () => {
    render(<Textarea aria-label="Notes" autoSize />);
    expect(screen.getByLabelText("Notes").className).toContain("autoSize");
  });

  it("forwards a ref", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Notes" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("passes native attributes through", () => {
    render(<Textarea aria-label="Notes" rows={8} maxLength={200} />);
    expect(screen.getByLabelText("Notes")).toHaveAttribute("rows", "8");
    expect(screen.getByLabelText("Notes")).toHaveAttribute("maxlength", "200");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    await expect(container).toHaveNoAxeViolations();
  });
});
