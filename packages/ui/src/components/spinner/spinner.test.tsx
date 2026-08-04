import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("announces itself as a status with a default label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Fetching results" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Fetching results",
    );
  });

  it("withdraws from the accessibility tree when the label is null", () => {
    render(<Spinner label={null} data-testid="spinner" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toHaveAttribute("aria-hidden", "true");
  });

  it.each(["sm", "md", "lg"] as const)("applies the %s size class", (size) => {
    render(<Spinner size={size} data-testid="spinner" />);
    expect(screen.getByTestId("spinner").className).toContain(size);
  });

  it("merges consumer class names", () => {
    render(<Spinner className="custom" data-testid="spinner" />);
    expect(screen.getByTestId("spinner")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner />);
    await expect(container).toHaveNoAxeViolations();
  });
});
