import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Card, CardBody, CardFooter, CardHeader } from "./card";

describe("Card", () => {
  it("renders a div by default and the element given by `as`", () => {
    const { rerender } = render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId("card").tagName).toBe("DIV");

    rerender(
      <Card as="article" data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card").tagName).toBe("ARTICLE");
  });

  it.each(["outlined", "elevated", "filled"] as const)(
    "applies the %s variant class",
    (variant) => {
      render(
        <Card variant={variant} data-testid="card">
          content
        </Card>,
      );
      expect(screen.getByTestId("card").className).toContain(variant);
    },
  );

  it("adds interactive affordances only when asked", () => {
    const { rerender } = render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId("card").className).not.toContain("interactive");

    rerender(
      <Card interactive data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("interactive");
  });

  it("composes header, body and footer", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter divided>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("forwards refs on every part", () => {
    const card = React.createRef<HTMLDivElement>();
    const header = React.createRef<HTMLDivElement>();
    const body = React.createRef<HTMLDivElement>();
    const footer = React.createRef<HTMLDivElement>();

    render(
      <Card ref={card}>
        <CardHeader ref={header}>H</CardHeader>
        <CardBody ref={body}>B</CardBody>
        <CardFooter ref={footer}>F</CardFooter>
      </Card>,
    );

    expect(card.current).toBeInstanceOf(HTMLDivElement);
    expect(header.current).toBeInstanceOf(HTMLDivElement);
    expect(body.current).toBeInstanceOf(HTMLDivElement);
    expect(footer.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges consumer class names", () => {
    render(
      <Card className="custom" data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("custom");
  });

  it("has no axe violations, including with an interactive control inside", async () => {
    const { container } = render(
      <Card interactive as="article">
        <CardHeader>
          <h2>Title</h2>
        </CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>
          <a href="/read">Read more</a>
        </CardFooter>
      </Card>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
