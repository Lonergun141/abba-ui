import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

import { toHaveNoAxeViolations } from "./axe";

expect.extend({ toHaveNoAxeViolations });

afterEach(() => {
  cleanup();
});
