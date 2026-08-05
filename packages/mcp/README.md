# @abbainitiative/mcp

An MCP server for **[ABBA UI](https://abba-ui.vercel.app)**. Point your coding agent at it and it can look up real components, props and design tokens instead of guessing at them.

Works with Claude Code, Codex, Cursor, Windsurf, Zed — anything that speaks the Model Context Protocol.

---

## Why

Agents write React well and remember component APIs badly. Left to guess, they invent plausible props:

```tsx
<Button color="primary" size="medium">Save</Button>   // none of this is real
<Button variant="primary" size="md">Save</Button>     // this is
```

This server gives the agent the actual answer — every prop, its type, its default, and a working example.

## Setup

You do not need to install anything. Both clients below run it with `npx`.

### Claude Code

```bash
claude mcp add abba-ui -- npx -y @abbainitiative/mcp
```

Or add it to `.mcp.json` in your project root, so it is shared with everyone on the repo:

```json
{
  "mcpServers": {
    "abba-ui": {
      "command": "npx",
      "args": ["-y", "@abbainitiative/mcp"]
    }
  }
}
```

Check it connected with `/mcp`.

### Codex

Add it to `~/.codex/config.toml`:

```toml
[mcp_servers.abba-ui]
command = "npx"
args = ["-y", "@abbainitiative/mcp"]
```

### Cursor, Windsurf, Zed and others

Most clients take the same shape in their own config file:

```json
{
  "mcpServers": {
    "abba-ui": {
      "command": "npx",
      "args": ["-y", "@abbainitiative/mcp"]
    }
  }
}
```

### Pinning a version

`npx -y @abbainitiative/mcp` fetches the latest. To pin, name the version: `@abbainitiative/mcp@0.1.0`.

## Tools

Every tool is read-only. Nothing here writes files, touches your project or reaches the network — the catalogue is bundled in the package.

| Tool                | What it answers                                                              |
| ------------------- | ---------------------------------------------------------------------------- |
| `list_components`   | What components exist? Optionally filtered to one category.                  |
| `get_component`     | What props does `Dialog` take, and how do I compose it?                      |
| `search_components` | I need a modal / a loading state / a status marker — what is it called here? |
| `list_tokens`       | What CSS variables can I override?                                           |
| `find_token`        | Does `--abba-primary-subtle` exist, and what is it?                          |
| `get_theming`       | How do I restyle this for my brand, including dark mode?                     |
| `get_setup`         | How do I install it in Next.js / Vite?                                       |

`get_component` accepts a name, a slug, or a near miss — `Button`, `button`, `dropdown-menu` and `Dailog` all resolve.

`get_theming` takes a topic: `overview`, `colour`, `shape`, `typography`, `dark-mode`, `scoped`.

## What the agent gets back

`get_component` with `{ "name": "Badge" }`:

```markdown
# Badge

**Category:** Data display
**Client boundary:** Renders in a React Server Component with no client boundary of your own.

Seven tones across three variants. Because a badge's meaning is usually carried
by its colour, `srLabel` lets you supply the words that colour stands for.

## Import

import { Badge } from "@abbainitiative/ui";

## Props

| Prop | Type | Default | Description |
| `tone` | `"neutral" \| "primary" \| "accent" \| …` | `"neutral"` | Semantic colour role. |
| `srLabel` | `string` | — | Text announced before the label. |

## Examples

…runnable tsx…

## Accessibility

- Colour is not available to screen readers — use `srLabel` where the tone is the message.
```

## Running it from source

```bash
pnpm --filter @abbainitiative/mcp build
node packages/mcp/dist/index.js
```

It speaks JSON-RPC over stdio, so it will sit there waiting for input. To drive it by hand:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node packages/mcp/dist/index.js
```

## Notes

- **stdout is the transport.** A stray `console.log` corrupts the stream and surfaces as an unexplained disconnect. Diagnostics go to stderr.
- The component catalogue comes from [`@abbainitiative/registry`](../registry), which is also what the documentation site renders — so this server and the docs cannot describe different component sets.

MIT © ABBA Initiative
