import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { FormMessage } from "./form-message";

describe("FormMessage", () => {
  it("renders helper text without an alert role", () => {
    render(<FormMessage>Use your work address</FormMessage>);
    expect(screen.getByText("Use your work address")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("announces errors", () => {
    render(<FormMessage tone="error">Required</FormMessage>);
    const message = screen.getByRole("alert");
    expect(message).toHaveTextContent("Required");
    expect(message).toHaveAttribute("aria-live", "polite");
  });

  it("does not make descriptions live by default", () => {
    render(<FormMessage tone="description">Hint</FormMessage>);
    expect(screen.getByText("Hint")).not.toHaveAttribute("aria-live");
  });

  it("allows the live behaviour to be overridden", () => {
    render(
      <FormMessage tone="description" live>
        Hint
      </FormMessage>,
    );
    expect(screen.getByText("Hint")).toHaveAttribute("aria-live", "polite");
  });

  it.each(["description", "error", "success"] as const)(
    "applies the %s tone class",
    (tone) => {
      render(
        <FormMessage tone={tone} data-testid="message">
          Text
        </FormMessage>,
      );
      expect(screen.getByTestId("message").className).toContain(tone);
    },
  );

  it("forwards a ref and merges class names", () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(
      <FormMessage ref={ref} className="custom" data-testid="message">
        Text
      </FormMessage>,
    );
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    expect(screen.getByTestId("message")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<FormMessage tone="error">Required</FormMessage>);
    await expect(container).toHaveNoAxeViolations();
  });
});
