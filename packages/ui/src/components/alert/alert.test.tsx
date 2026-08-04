import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./alert";

describe("Alert", () => {
  it("renders its title and body", () => {
    render(<Alert title="Heads up">Something happened.</Alert>);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened.")).toBeInTheDocument();
  });

  it.each([
    ["danger", "alert"],
    ["warning", "alert"],
    ["info", "status"],
    ["success", "status"],
  ] as const)("uses role=%s for the %s tone", (tone, role) => {
    render(<Alert tone={tone}>Message</Alert>);
    expect(screen.getByRole(role)).toBeInTheDocument();
  });

  it("interrupts for urgent tones and waits for a pause otherwise", () => {
    const { rerender } = render(<Alert tone="danger">Message</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");

    rerender(<Alert tone="info">Message</Alert>);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("renders no close button unless onDismiss is supplied", () => {
    render(<Alert>Message</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onDismiss from the close button", async () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Message</Alert>);

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("accepts a custom dismiss label", () => {
    render(
      <Alert onDismiss={vi.fn()} dismissLabel="Close notice">
        Message
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Close notice" })).toBeInTheDocument();
  });

  it("accepts a replacement icon", () => {
    render(<Alert icon={<span data-testid="custom-icon" />}>Message</Alert>);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("merges consumer class names and native props", () => {
    render(
      <Alert className="custom" data-testid="alert">
        Message
      </Alert>,
    );
    expect(screen.getByTestId("alert")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Alert tone="danger" title="Payment failed" onDismiss={vi.fn()}>
        Update your card details.
      </Alert>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
