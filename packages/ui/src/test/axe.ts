import axe, { type AxeResults, type ElementContext, type RunOptions } from "axe-core";

/**
 * Accessibility matcher built directly on axe-core.
 *
 * `vitest-axe` is the obvious off-the-shelf choice but sits at 0.1.0 and is
 * effectively unmaintained; the brief forbids depending on such packages.
 * Owning these few lines is cheaper than inheriting that risk, and it lets the
 * failure message list the exact nodes rather than a generic assertion error.
 */
export async function toHaveNoAxeViolations(
  received: Element | Document,
  options?: RunOptions,
): Promise<{ pass: boolean; message: () => string }> {
  const results: AxeResults = await axe.run(received as ElementContext, {
    // Colour contrast cannot be computed in jsdom: it has no layout or paint,
    // so every node resolves to transparent and the rule reports false
    // positives. Contrast is verified against real rendering in the Playwright
    // suite instead.
    rules: { "color-contrast": { enabled: false } },
    ...options,
  });

  if (results.violations.length === 0) {
    return {
      pass: true,
      message: () => "expected accessibility violations, found none",
    };
  }

  const detail = results.violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `      - ${node.html}\n        ${node.failureSummary ?? ""}`)
        .join("\n");
      return `  [${violation.impact ?? "unknown"}] ${violation.id}: ${violation.help}\n${nodes}`;
    })
    .join("\n\n");

  return {
    pass: false,
    message: () =>
      `expected no accessibility violations, found ${String(results.violations.length)}:\n\n${detail}`,
  };
}

declare module "vitest" {
  /**
   * TypeScript requires an interface augmentation to repeat the original type
   * parameters exactly, and upstream declares `Matchers<T = any>` in
   * `@vitest/expect`. The `any` here is imposed by that declaration, not
   * chosen — narrowing it to `unknown` fails with TS2428. The augmentation
   * targets `vitest` rather than `@vitest/expect` because only `vitest` is a
   * direct dependency and therefore resolvable.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> {
    toHaveNoAxeViolations: (options?: RunOptions) => Promise<T>;
  }
}
