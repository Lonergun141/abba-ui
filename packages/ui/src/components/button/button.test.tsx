import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders a real button element with its label", () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("defaults to type=button so it does not submit forms unexpectedly", () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("honours an explicit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it.each(["primary", "secondary", "outline", "ghost", "danger"] as const)(
    "applies the %s variant class",
    (variant) => {
      render(<Button variant={variant}>Label</Button>);
      expect(screen.getByRole("button").className).toContain(variant);
    },
  );

  it.each(["sm", "md", "lg"] as const)("applies the %s size class", (size) => {
    render(<Button size={size}>Label</Button>);
    expect(screen.getByRole("button").className).toContain(size);
  });

  it("merges a consumer class name without dropping internal ones", () => {
    render(<Button className="my-class">Label</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("my-class");
    expect(button.className.split(" ").length).toBeGreaterThan(1);
  });

  it("forwards a ref to the underlying button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Label</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes native attributes through", () => {
    render(
      <Button data-testid="native" aria-describedby="hint" name="action">
        Label
      </Button>,
    );
    const button = screen.getByTestId("native");
    expect(button).toHaveAttribute("aria-describedby", "hint");
    expect(button).toHaveAttribute("name", "action");
  });

  it("fires onClick when activated with the mouse", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Label</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("activates on Enter and Space, from the platform not from handlers", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Label</Button>);
    const button = screen.getByRole("button");

    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  describe("disabled", () => {
    it("sets the disabled attribute", () => {
      render(<Button disabled>Label</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not fire onClick", async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Label
        </Button>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("loading", () => {
    it("marks the button busy and disables it", () => {
      render(<Button loading>Save</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toBeDisabled();
    });

    it("exposes the loading label to assistive technology", () => {
      render(<Button loading loadingLabel="Saving changes" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Saving changes",
      );
    });

    it("keeps the label in the accessible name so the button stays identifiable", () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole("button").textContent).toContain("Save");
    });

    it("does not fire onClick while loading", async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("icons", () => {
    it("hides decorative icons from assistive technology", () => {
      render(<Button leftIcon={<span data-testid="icon">*</span>}>Label</Button>);
      expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("keeps the accessible name free of icon content", () => {
      render(<Button rightIcon={<span>→</span>}>Continue</Button>);
      expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    });
  });

  describe("asChild", () => {
    it("renders the child element instead of a button", () => {
      render(
        <Button asChild>
          <a href="/next">Go next</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Go next" });
      expect(link).toHaveAttribute("href", "/next");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies its styling classes to the child", () => {
      render(
        <Button asChild variant="danger">
          <a href="/x">Delete</a>
        </Button>,
      );
      expect(screen.getByRole("link").className).toContain("danger");
    });

    it("uses aria-disabled, since anchors have no disabled attribute", () => {
      render(
        <Button asChild disabled>
          <a href="/x">Blocked</a>
        </Button>,
      );
      expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("has no axe violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    await expect(container).toHaveNoAxeViolations();
  });

  it("has no axe violations while loading", async () => {
    const { container } = render(<Button loading>Accessible</Button>);
    await expect(container).toHaveNoAxeViolations();
  });
});
