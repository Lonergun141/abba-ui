import { components, tokens } from "@abbainitiative/registry";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createServer } from "./server.js";

/**
 * Drives the server through a real MCP client over a linked in-memory
 * transport, rather than calling the tool callbacks directly.
 *
 * The difference matters: this exercises schema validation, the JSON-RPC
 * envelope and the content shape, which is where an MCP server actually breaks.
 * A test that invokes the callback by hand would pass with a malformed schema.
 */

let client: Client;
let close: () => Promise<void>;

beforeEach(async () => {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);

  close = async () => {
    await client.close();
    await server.close();
  };
});

afterEach(async () => {
  await close();
});

/** Tool results are a content array; every tool here returns a single text block. */
async function callText(
  name: string,
  args: Record<string, unknown> = {},
): Promise<string> {
  const result = await client.callTool({ name, arguments: args });
  const content = result.content as { type: string; text?: string }[];
  expect(content).toHaveLength(1);
  expect(content[0]?.type).toBe("text");
  return content[0]?.text ?? "";
}

/**
 * Schema violations come back as a result with `isError`, not as a rejection —
 * the SDK reports them in-band so the model can read and correct them.
 */
async function callExpectingError(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const result = await client.callTool({ name, arguments: args });
  expect(result.isError, `${name} accepted arguments it should have rejected`).toBe(
    true,
  );
  const content = result.content as { text?: string }[];
  return content[0]?.text ?? "";
}

describe("tool registration", () => {
  it("advertises every tool with a description and a schema", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((tool) => tool.name).sort();

    expect(names).toEqual([
      "find_token",
      "get_component",
      "get_setup",
      "get_theming",
      "list_components",
      "list_tokens",
      "search_components",
    ]);

    for (const tool of tools) {
      expect(tool.description, `${tool.name} has no description`).toBeTruthy();
      expect(tool.inputSchema, `${tool.name} has no input schema`).toBeTruthy();
      // Every tool here only reads; the annotation is what tells a client it is
      // safe to call without confirmation.
      expect(
        tool.annotations?.readOnlyHint,
        `${tool.name} is not marked read-only`,
      ).toBe(true);
    }
  });

  it("ships instructions telling the agent to look props up", () => {
    const instructions = client.getInstructions();
    expect(instructions).toContain("get_component");
  });
});

describe("list_components", () => {
  it("lists every component", async () => {
    const body = await callText("list_components");
    for (const component of components) {
      expect(body, `${component.name} missing from the list`).toContain(component.name);
    }
  });

  it("filters to a category", async () => {
    const body = await callText("list_components", { category: "Overlays" });
    expect(body).toContain("Dialog");
    expect(body).toContain("Tabs");
    expect(body).not.toContain("**Stack**");
  });

  it("rejects a category that is not in the union, and names the valid ones", async () => {
    const message = await callExpectingError("list_components", {
      category: "Nonsense",
    });
    expect(message).toContain("Overlays");
  });
});

describe("get_component", () => {
  it("returns props, examples and accessibility notes", async () => {
    const body = await callText("get_component", { name: "Button" });

    expect(body).toContain("# Button");
    expect(body).toContain("variant");
    expect(body).toContain('import { Button } from "@abbainitiative/ui";');
    expect(body).toContain("## Accessibility");
  });

  it("escapes the pipes in union types so the prop table survives", async () => {
    const body = await callText("get_component", { name: "Button" });

    // Unescaped, `"sm" | "md" | "lg"` splits the row into extra columns and the
    // model reads types against the wrong props.
    expect(body).toContain(
      '"primary" \\| "secondary" \\| "outline" \\| "ghost" \\| "danger"',
    );

    const rows = body
      .split("\n")
      .filter((line) => line.startsWith("| `") && !line.startsWith("| ---"));
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      // Four columns means five delimiters once the escaped pipes are removed.
      const columns = row.replace(/\\\|/g, "").split("|").length;
      expect(columns, `row has ${String(columns - 1)} cells: ${row}`).toBe(6);
    }
  });

  it("states the client boundary so the agent knows where it can render", async () => {
    expect(await callText("get_component", { name: "Stack" })).toContain(
      "Renders in a React Server Component",
    );
    expect(await callText("get_component", { name: "Dialog" })).toContain(
      '"use client"',
    );
  });

  it("accepts a name, a slug, or the wrong casing", async () => {
    for (const name of [
      "DropdownMenu",
      "dropdown-menu",
      "dropdownmenu",
      "DROPDOWNMENU",
    ]) {
      expect(await callText("get_component", { name }), `failed for ${name}`).toContain(
        "# DropdownMenu",
      );
    }
  });

  it("corrects a typo rather than failing flatly", async () => {
    for (const typo of ["Buton", "Tabss", "Dailog", "Bagde"]) {
      const body = await callText("get_component", { name: typo });
      expect(body, `no suggestion for ${typo}`).toContain("Did you mean");
    }
    expect(await callText("get_component", { name: "Buton" })).toContain("Button");
    expect(await callText("get_component", { name: "Dailog" })).toContain("Dialog");
  });

  it("resolves a sub-component name to its parent", async () => {
    // An agent that saw `CardFooter` in an example should land on Card.
    expect(await callText("get_component", { name: "CardFooter" })).toContain("Card");
  });

  it("points at the full list when nothing is close", async () => {
    const body = await callText("get_component", { name: "zzzzz" });
    expect(body).toContain("list_components");
  });

  it("documents every component in the registry", async () => {
    // Guards against a component being added to the registry with data the
    // formatter cannot render.
    for (const component of components) {
      const body = await callText("get_component", { name: component.slug });
      expect(body, `${component.name} rendered no heading`).toContain(
        `# ${component.name}`,
      );
      expect(body).toContain("## Props");
    }
  });
});

describe("search_components", () => {
  it("finds a component by a word in its description", async () => {
    expect(await callText("search_components", { query: "modal" })).toContain("Dialog");
  });

  it("finds a component by a prop name", async () => {
    expect(await callText("search_components", { query: "autoSize" })).toContain(
      "Textarea",
    );
  });

  it("reports an empty result rather than an empty string", async () => {
    const body = await callText("search_components", { query: "quantum" });
    expect(body).toContain("0 of");
    expect(body).toContain("list_components");
  });

  it("asks for a term when given whitespace", async () => {
    expect(await callText("search_components", { query: "   " })).toContain(
      "Give a search term",
    );
  });
});

describe("list_tokens", () => {
  it("lists every token", async () => {
    const body = await callText("list_tokens");
    expect(body).toContain(String(tokens.length));
    expect(body).toContain("--abba-primary");
    expect(body).toContain("--abba-space-4");
    expect(body).toContain("--abba-radius-md");
  });

  it("filters to one group", async () => {
    const body = await callText("list_tokens", { group: "radius" });
    expect(body).toContain("--abba-radius-md");
    expect(body).not.toContain("--abba-space-4");
  });

  it("names the valid groups when given an unknown one", async () => {
    const body = await callText("list_tokens", { group: "colours" });
    expect(body).toContain("Available groups");
    expect(body).toContain("palette-cedar");
  });
});

describe("find_token", () => {
  it("resolves a token with or without the prefix", async () => {
    expect(await callText("find_token", { name: "--abba-primary" })).toContain(
      "var(--abba-cedar-600)",
    );
    expect(await callText("find_token", { name: "primary" })).toContain(
      "var(--abba-cedar-600)",
    );
  });

  it("offers close matches for a near miss", async () => {
    const body = await callText("find_token", { name: "radius" });
    expect(body).toContain("Close matches");
    expect(body).toContain("--abba-radius-md");
  });
});

describe("get_theming", () => {
  it("defaults to an overview that names the two rules", async () => {
    const body = await callText("get_theming");
    expect(body).toContain("after the ABBA stylesheet");
    expect(body).toContain("semantic layer");
  });

  it("warns that class names are not public API", async () => {
    expect(await callText("get_theming", { topic: "overview" })).toContain(
      "not public API",
    );
  });

  it("tells the agent a custom accent needs its own dark set", async () => {
    const body = await callText("get_theming", { topic: "dark-mode" });
    expect(body).toContain('[data-theme="dark"]');
    expect(body).toContain("--abba-primary-foreground");
  });

  it("explains scoping a theme to a subtree", async () => {
    expect(await callText("get_theming", { topic: "scoped" })).toContain("inherit");
  });

  it("rejects a topic outside the union, and names the valid ones", async () => {
    const message = await callExpectingError("get_theming", { topic: "vibes" });
    expect(message).toContain("dark-mode");
  });
});

describe("get_setup", () => {
  it("defaults to Next.js", async () => {
    const body = await callText("get_setup");
    expect(body).toContain("# Next.js App Router");
  });

  it("warns against transpilePackages for Next.js", async () => {
    expect(await callText("get_setup", { framework: "nextjs" })).toContain(
      "transpilePackages",
    );
  });

  it("points Vite at the entry file", async () => {
    const body = await callText("get_setup", { framework: "vite" });
    expect(body).toContain("src/main.tsx");
    expect(body).toContain("@abbainitiative/ui/styles.css");
  });
});
