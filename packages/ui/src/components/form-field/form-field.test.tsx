import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "../input/input";
import { FormField } from "./form-field";

describe("FormField", () => {
  it("associates the label with the control", () => {
    render(
      <FormField label="Email address">
        <Input />
      </FormField>,
    );
    // getByLabelText only resolves when htmlFor and id genuinely match.
    expect(screen.getByLabelText("Email address")).toBeInstanceOf(HTMLInputElement);
  });

  it("focuses the control when the label is clicked", async () => {
    render(
      <FormField label="Full name">
        <Input />
      </FormField>,
    );
    await userEvent.click(screen.getByText("Full name"));
    expect(screen.getByLabelText("Full name")).toHaveFocus();
  });

  it("describes the control with its helper text", () => {
    render(
      <FormField label="Password" description="At least 12 characters">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription(
      "At least 12 characters",
    );
  });

  it("marks the control invalid and announces the error", () => {
    render(
      <FormField label="Email" error="Enter a valid email address">
        <Input />
      </FormField>,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address");
    expect(input).toHaveAccessibleDescription(/Enter a valid email address/);
  });

  it("describes the control with both helper text and error at once", () => {
    render(
      <FormField label="Email" description="Work address" error="Already taken">
        <Input />
      </FormField>,
    );
    const description = screen.getByLabelText("Email").getAttribute("aria-describedby");
    expect(description?.split(" ")).toHaveLength(2);
  });

  it("propagates required to the control and the label", () => {
    render(
      <FormField label="Email" required>
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText(/Email/)).toBeRequired();
    // The asterisk is decorative; the word is what gets announced.
    expect(screen.getByText("required")).toBeInTheDocument();
  });

  it("propagates disabled to the control", () => {
    render(
      <FormField label="Email" disabled>
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("does not override an id the consumer set explicitly", () => {
    render(
      <FormField label="Email">
        <Input id="my-own-id" />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "my-own-id");
  });

  it("does not override an explicit aria-describedby", () => {
    render(
      <FormField label="Email" description="ignored">
        <Input aria-describedby="external-hint" />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      "external-hint",
    );
  });

  it("renders no message region when there is nothing to say", () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-describedby");
  });

  it("generates unique ids across multiple fields", () => {
    render(
      <>
        <FormField label="First">
          <Input />
        </FormField>
        <FormField label="Second">
          <Input />
        </FormField>
      </>,
    );
    const first = screen.getByLabelText("First").getAttribute("id");
    const second = screen.getByLabelText("Second").getAttribute("id");
    expect(first).not.toBe(second);
  });

  it("has no axe violations, including in the error state", async () => {
    const { container } = render(
      <FormField label="Email" description="Work address" error="Already taken" required>
        <Input />
      </FormField>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
