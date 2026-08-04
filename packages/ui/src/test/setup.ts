import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

import { toHaveNoAxeViolations } from "./axe";

expect.extend({ toHaveNoAxeViolations });

/**
 * jsdom implements no layout engine, so the browser APIs Radix's positioning
 * and pointer handling rely on are simply absent. Without these the overlay
 * components throw during render and every test fails for a reason unrelated to
 * the behaviour under test.
 *
 * These are shims, not simulations: they satisfy the call, and anything that
 * genuinely depends on measured geometry is covered by the Playwright suite
 * against a real browser instead.
 */
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {
      /* no layout to observe */
    }
    unobserve(): void {
      /* no layout to observe */
    }
    disconnect(): void {
      /* no layout to observe */
    }
  };
}

if (!("DOMRect" in globalThis)) {
  globalThis.DOMRect = class DOMRect {
    constructor(
      public x = 0,
      public y = 0,
      public width = 0,
      public height = 0,
    ) {}
    get top(): number {
      return this.y;
    }
    get left(): number {
      return this.x;
    }
    get right(): number {
      return this.x + this.width;
    }
    get bottom(): number {
      return this.y + this.height;
    }
    static fromRect(): DOMRect {
      return new DOMRect();
    }
    toJSON(): unknown {
      return this;
    }
  };
}

// Pointer capture and scrollIntoView are unimplemented in jsdom; Radix calls
// both while managing focus inside menus and dialogs.
//
// Guarded on `Element` existing: this setup file also runs for suites declaring
// `@vitest-environment node`, where there is no DOM at all.
if (typeof Element !== "undefined" && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = (): boolean => false;
}
if (typeof Element !== "undefined" && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = (): void => undefined;
}
if (typeof Element !== "undefined" && !Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = (): void => undefined;
}
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = (): void => undefined;
}

if (!("matchMedia" in globalThis)) {
  globalThis.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

afterEach(() => {
  cleanup();
});
