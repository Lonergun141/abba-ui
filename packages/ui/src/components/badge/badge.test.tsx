import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it.each([
    "neutral",
    "primary",
    "accent",
    "success",
    "warning",
    "danger",
    "info",
  ] as const)("applies the %s tone class", (tone) => {
    render(
      <Badge tone={tone} data-testid="badge">
        Label
      </Badge>,
    );
    expect(screen.getByTestId("badge").className).toContain(tone);
  });

  it.each(["subtle", "solid", "outline"] as const)(
    "applies the %s variant class",
    (variant) => {
      render(
        <Badge variant={variant} data-testid="badge">
          Label
        </Badge>,
      );
      expect(screen.getByTestId("badge").className).toContain(variant);
    },
  );

  it.each(["sm", "md", "lg"] as const)("applies the %s size class", (size) => {
    render(
      <Badge size={size} data-testid="badge">
        Label
      </Badge>,
    );
    expect(screen.getByTestId("badge").className).toContain(size);
  });

  it("hides the status dot from assistive technology", () => {
    const { container } = render(<Badge dot>Online</Badge>);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("announces a screen-reader label, since colour alone carries no meaning", () => {
    render(
      <Badge tone="danger" srLabel="Status:">
        Overdue
      </Badge>,
    );
    expect(screen.getByText("Status:")).toBeInTheDocument();
  });

  it("forwards a ref and merges class names", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="custom" data-testid="badge">
        Label
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("badge")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Badge tone="success" dot srLabel="Status:">
        Active
      </Badge>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
