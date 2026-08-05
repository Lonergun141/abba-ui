import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Code } from "../components/code/code";
import { Heading } from "../components/heading/heading";
import { Label } from "../components/label/label";
import { Link } from "../components/link/link";
import { Text } from "../components/text/text";

describe("Text", () => {
  it("renders a paragraph by default", () => {
    render(<Text>Body copy</Text>);
    expect(screen.getByText("Body copy").tagName).toBe("P");
  });

  it("renders the element given by `as`", () => {
    render(<Text as="span">Inline copy</Text>);
    expect(screen.getByText("Inline copy").tagName).toBe("SPAN");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)("applies the %s size", (size) => {
    render(<Text size={size}>Copy</Text>);
    expect(screen.getByText("Copy").className).toContain(size);
  });

  it.each(["muted", "primary", "danger", "success"] as const)(
    "applies the %s tone",
    (tone) => {
      render(<Text tone={tone}>Copy</Text>);
      expect(screen.getByText("Copy").className).toContain(tone);
    },
  );

  it("applies truncation and forwards a ref", () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(
      <Text truncate ref={ref}>
        Copy
      </Text>,
    );
    expect(screen.getByText("Copy").className).toContain("truncate");
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe("Heading", () => {
  it("renders h2 by default", () => {
    render(<Heading>Section</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it.each([1, 2, 3, 4, 5, 6] as const)(
    "renders level %s as the matching element",
    (level) => {
      render(<Heading level={level}>Title</Heading>);
      expect(screen.getByRole("heading", { level })).toBeInTheDocument();
    },
  );

  it("picks a default size from the level", () => {
    render(<Heading level={1}>Title</Heading>);
    expect(screen.getByRole("heading").className).toContain("xl");
  });

  it("lets size be set independently of rank, so outline and visuals can differ", () => {
    render(
      <Heading level={3} size="display">
        Title
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.className).toContain("display");
  });
});

describe("Label", () => {
  it("associates with a control through htmlFor", () => {
    render(
      <>
        <Label htmlFor="field">Email</Label>
        <input id="field" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });

  it("focuses the control when clicked", async () => {
    render(
      <>
        <Label htmlFor="field">Email</Label>
        <input id="field" />
      </>,
    );
    await userEvent.click(screen.getByText("Email"));
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("announces the required state in words, not just an asterisk", () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("required")).toBeInTheDocument();
  });

  it("dims when disabled", () => {
    render(
      <Label disabled data-testid="label">
        Email
      </Label>,
    );
    expect(screen.getByTestId("label").className).toContain("disabled");
  });
});

describe("Code", () => {
  it("renders inline code by default", () => {
    render(<Code>npm i</Code>);
    expect(screen.getByText("npm i").tagName).toBe("CODE");
  });

  it("wraps block code in a pre so whitespace survives", () => {
    render(<Code variant="block">{"line one\nline two"}</Code>);
    const code = screen.getByText(/line one/);
    expect(code.closest("pre")).not.toBeNull();
  });
});

describe("Link", () => {
  it("renders an anchor with its href", () => {
    render(<Link href="/docs">Docs</Link>);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("secures external links and announces the new tab", () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("(opens in a new tab)")).toBeInTheDocument();
  });

  it("lets an explicit rel or target win", () => {
    render(
      <Link href="https://example.com" external rel="nofollow" target="_self">
        Example
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "nofollow");
    expect(link).toHaveAttribute("target", "_self");
  });

  it.each(["always", "hover", "none"] as const)(
    "applies the %s underline class",
    (underline) => {
      render(
        <Link href="/x" underline={underline}>
          Link
        </Link>,
      );
      expect(screen.getByRole("link").className).toContain(underline);
    },
  );

  it("has no axe violations", async () => {
    const { container } = render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
