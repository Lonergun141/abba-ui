import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Box } from "./box";

describe("Box", () => {
  it("renders a div by default", () => {
    render(<Box data-testid="box">content</Box>);
    expect(screen.getByTestId("box").tagName).toBe("DIV");
  });

  it("renders the element given by `as`", () => {
    render(
      <Box as="section" data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("SECTION");
  });

  it("maps padding to the spacing token rather than a raw value", () => {
    render(
      <Box padding={4} data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({
      paddingBlock: "var(--abba-space-4)",
      paddingInline: "var(--abba-space-4)",
    });
  });

  it("lets axis padding override the shorthand on that axis only", () => {
    render(
      <Box padding={2} paddingInline={8} data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({
      paddingInline: "var(--abba-space-8)",
      paddingBlock: "var(--abba-space-2)",
    });
  });

  it("applies surface, radius and shadow tokens", () => {
    render(
      <Box background="subtle" radius="lg" shadow="md" data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({
      background: "var(--abba-background-subtle)",
      borderRadius: "var(--abba-radius-lg)",
      boxShadow: "var(--abba-shadow-md)",
    });
  });

  it("lets a consumer style override a token-derived value", () => {
    render(
      <Box padding={4} style={{ paddingInline: "3px" }} data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({ paddingInline: "3px" });
  });

  it("adds a border only when asked", () => {
    const { rerender } = render(<Box data-testid="box">content</Box>);
    const plain = screen.getByTestId("box").className;

    rerender(
      <Box bordered data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box").className).not.toBe(plain);
  });

  it("merges consumer class names", () => {
    render(
      <Box className="custom" data-testid="box">
        content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveClass("custom");
  });

  it("forwards a ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Box ref={ref}>content</Box>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Box>content</Box>);
    await expect(container).toHaveNoAxeViolations();
  });
});
