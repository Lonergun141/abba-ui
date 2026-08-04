import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Container } from "../components/container/container";
import { Grid } from "../components/grid/grid";
import { Inline } from "../components/inline/inline";
import { Separator } from "../components/separator/separator";
import { Stack } from "../components/stack/stack";
import { VisuallyHidden } from "../components/visually-hidden/visually-hidden";

/**
 * The layout primitives are structurally identical — a styled element with
 * token-mapped props — so they are grouped rather than split across six files
 * that would each repeat the same four assertions.
 */

describe("Stack", () => {
  it("lays children out in a column", () => {
    render(<Stack data-testid="stack">content</Stack>);
    expect(screen.getByTestId("stack")).toHaveStyle({ flexDirection: "column" });
  });

  it("maps gap to a spacing token", () => {
    render(
      <Stack gap={4} data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveStyle({ gap: "var(--abba-space-4)" });
  });

  it("translates alignment props to CSS values", () => {
    render(
      <Stack align="center" justify="between" data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveStyle({
      alignItems: "center",
      justifyContent: "space-between",
    });
  });

  it("renders the element given by `as` and forwards a ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Stack as="section" ref={ref} data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId("stack").tagName).toBe("SECTION");
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe("Inline", () => {
  it("lays children out in a row", () => {
    render(<Inline data-testid="inline">content</Inline>);
    expect(screen.getByTestId("inline")).toHaveStyle({ flexDirection: "row" });
  });

  it("wraps by default, so narrow viewports do not overflow", () => {
    render(<Inline data-testid="inline">content</Inline>);
    expect(screen.getByTestId("inline")).toHaveStyle({ flexWrap: "wrap" });
  });

  it("can opt out of wrapping", () => {
    render(
      <Inline wrap={false} data-testid="inline">
        content
      </Inline>,
    );
    expect(screen.getByTestId("inline")).not.toHaveStyle({ flexWrap: "wrap" });
  });

  it("centres on the cross axis by default", () => {
    render(<Inline data-testid="inline">content</Inline>);
    expect(screen.getByTestId("inline")).toHaveStyle({ alignItems: "center" });
  });
});

describe("Container", () => {
  it.each(["sm", "md", "lg", "xl", "full"] as const)(
    "applies the %s size class",
    (size) => {
      render(
        <Container size={size} data-testid="container">
          content
        </Container>,
      );
      expect(screen.getByTestId("container").className).toContain(size);
    },
  );

  it("is padded by default and can opt out", () => {
    const { rerender } = render(<Container data-testid="container">c</Container>);
    expect(screen.getByTestId("container").className).toContain("padded");

    rerender(
      <Container padded={false} data-testid="container">
        c
      </Container>,
    );
    expect(screen.getByTestId("container").className).not.toContain("padded");
  });
});

describe("Grid", () => {
  it("builds a fixed column track list", () => {
    render(
      <Grid columns={3} data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveStyle({
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    });
  });

  it("builds a self-reflowing track list from minItemWidth", () => {
    render(
      <Grid minItemWidth="16rem" data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId("grid").style.gridTemplateColumns).toContain("auto-fill");
  });

  it("prefers minItemWidth over a fixed column count", () => {
    render(
      <Grid columns={4} minItemWidth="16rem" data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId("grid").style.gridTemplateColumns).not.toContain(
      "repeat(4",
    );
  });
});

describe("Separator", () => {
  it("is decorative by default, so it is not announced", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute("role", "none");
  });

  it("becomes a semantic separator when it carries meaning", () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("reports a vertical orientation only when semantic", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });
});

describe("VisuallyHidden", () => {
  it("keeps its content in the accessibility tree", () => {
    render(<VisuallyHidden>Skip to content</VisuallyHidden>);
    // Present in the DOM and not aria-hidden: that is the whole contract.
    const node = screen.getByText("Skip to content");
    expect(node).toBeInTheDocument();
    expect(node).not.toHaveAttribute("aria-hidden");
  });

  it("renders the element given by `as`", () => {
    render(<VisuallyHidden as="div">Hidden</VisuallyHidden>);
    expect(screen.getByText("Hidden").tagName).toBe("DIV");
  });
});
