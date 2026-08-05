import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { findToken, tokenGroups, tokens } from "./tokens.js";

/**
 * Guards the one duplication in this package.
 *
 * `tokens.ts` describes what `packages/ui/src/styles/tokens.css` declares. Two
 * hand-maintained copies of the same list is exactly the arrangement that rots,
 * so this parses the stylesheet and fails the build the moment they disagree —
 * a token renamed in CSS but not here would otherwise leave the documentation
 * and the MCP server confidently describing a variable that does not exist.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const STYLESHEET = resolve(HERE, "..", "..", "ui", "src", "styles", "tokens.css");

/** Declarations in the `:root` block, which is the light theme and the full set. */
function parseRootTokens(css: string): Map<string, string> {
  const rootStart = css.indexOf(":root {");
  const rootEnd = css.indexOf("\n}", rootStart);
  const body = css.slice(rootStart, rootEnd);

  const declared = new Map<string, string>();
  // Values can span lines (font stacks, multi-part shadows), so match up to the
  // semicolon rather than to the end of the line.
  const pattern = /(--abba-[a-z0-9-]+)\s*:\s*([^;]+);/g;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body)) !== null) {
    const [, name, value] = match;
    if (name && value) declared.set(name, value.replace(/\s+/g, " ").trim());
  }
  return declared;
}

const css = readFileSync(STYLESHEET, "utf8");
const declared = parseRootTokens(css);

describe("token catalogue", () => {
  it("parses the stylesheet it is describing", () => {
    // A parser that silently matched nothing would make every test below pass.
    expect(declared.size).toBeGreaterThan(100);
  });

  it("describes every token the stylesheet declares", () => {
    const catalogued = new Set(tokens.map((token) => token.name));
    const missing = [...declared.keys()].filter((name) => !catalogued.has(name));
    expect(missing, "declared in tokens.css but absent from tokens.ts").toEqual([]);
  });

  it("does not describe tokens the stylesheet has dropped", () => {
    const undeclared = tokens.filter((token) => !declared.has(token.name));
    expect(
      undeclared.map((token) => token.name),
      "listed in tokens.ts but no longer declared in tokens.css",
    ).toEqual([]);
  });

  it("records the value the stylesheet actually declares", () => {
    const wrong = tokens
      .filter((token) => declared.get(token.name) !== token.value)
      .map(
        (token) =>
          `${token.name}: ${token.value} (css: ${String(declared.get(token.name))})`,
      );
    expect(wrong, "value in tokens.ts differs from tokens.css").toEqual([]);
  });

  it("has no duplicate entries", () => {
    const seen = new Set<string>();
    const duplicates = tokens.filter((token) => {
      if (seen.has(token.name)) return true;
      seen.add(token.name);
      return false;
    });
    expect(duplicates.map((token) => token.name)).toEqual([]);
  });

  it("gives every group a unique id", () => {
    const ids = tokenGroups.map((group) => group.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finds a token by full name or by suffix", () => {
    expect(findToken("--abba-primary")?.value).toBe("var(--abba-cedar-600)");
    expect(findToken("primary")?.value).toBe("var(--abba-cedar-600)");
    expect(findToken("does-not-exist")).toBeUndefined();
  });
});

describe("stylesheet location", () => {
  it("points at a file that exists", () => {
    // Guards against the package being moved without this path following it.
    expect(() => readFileSync(join(STYLESHEET), "utf8")).not.toThrow();
  });
});
