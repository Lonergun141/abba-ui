import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("keeps a literal zero, which is a valid class name", () => {
    expect(cn(0, "a")).toBe("0 a");
  });

  it("trims and collapses padding around values", () => {
    expect(cn("  a  ", " b ")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, undefined, null)).toBe("");
  });

  it("lets a consumer class survive to the end of the list", () => {
    expect(cn("root", undefined, "consumer")).toBe("root consumer");
  });
});
