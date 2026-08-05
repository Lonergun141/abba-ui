import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";

export const metadata: Metadata = {
  title: "MCP",
  description: "Connect coding agents to the ABBA UI component and token catalogue.",
};

const INSTALL = "npx -y @abbainitiative/mcp";

const CLAUDE = "claude mcp add abba-ui -- npx -y @abbainitiative/mcp";

const GENERIC_CONFIG = `{
  "mcpServers": {
    "abba-ui": {
      "command": "npx",
      "args": ["-y", "@abbainitiative/mcp"]
    }
  }
}`;

const CODEX_CONFIG = `[mcp_servers.abba-ui]
command = "npx"
args = ["-y", "@abbainitiative/mcp"]`;

export default function McpPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Getting started</span>
      <h1>MCP for coding agents</h1>
      <p className="lead">
        Give Claude Code, Codex, Cursor, Windsurf, or Zed the real ABBA UI component and
        token catalogue instead of asking them to guess at prop names.
      </p>

      <h2>What it does</h2>
      <p>
        The ABBA UI MCP server is a read-only Model Context Protocol server. It bundles
        the same registry used by this documentation site, so an agent can look up
        component props, search by intent, inspect CSS tokens, and retrieve theming or
        setup guidance.
      </p>

      <ul>
        <li>
          <code>list_components</code> — browse the component catalogue.
        </li>
        <li>
          <code>get_component</code> — inspect props, examples, and accessibility
          behavior.
        </li>
        <li>
          <code>search_components</code> — find a component by intent or near match.
        </li>
        <li>
          <code>list_tokens</code> and <code>find_token</code> — inspect the CSS token
          system.
        </li>
        <li>
          <code>get_theming</code> and <code>get_setup</code> — retrieve integration
          guidance.
        </li>
      </ul>

      <h2>Install the server</h2>
      <p>
        The server runs through <code>npx</code>, so you do not need to add it to your
        application&apos;s dependencies:
      </p>
      <CodeBlock code={INSTALL} language="bash" />

      <h2>Claude Code</h2>
      <p>Run this command once in your terminal:</p>
      <CodeBlock code={CLAUDE} language="bash" />
      <p>
        Check the connection inside Claude Code with <code>/mcp</code>.
      </p>

      <h2>Codex</h2>
      <p>
        Add the following entry to <code>~/.codex/config.toml</code>:
      </p>
      <CodeBlock code={CODEX_CONFIG} language="toml" />

      <h2>Cursor, Windsurf, Zed, and other clients</h2>
      <p>
        Add the equivalent server definition to the client&apos;s MCP configuration:
      </p>
      <CodeBlock code={GENERIC_CONFIG} language="json" />

      <h2>Pinning a version</h2>
      <p>
        The unpinned command always fetches the latest published server. For repeatable
        team configuration, pin a release explicitly:
      </p>
      <CodeBlock code="npx -y @abbainitiative/mcp@0.1.0" language="bash" />

      <h2>What it cannot do</h2>
      <p>
        Every tool is read-only. The server does not write files, modify your project,
        or make network requests after it starts. It only answers questions from the
        bundled ABBA UI catalogue.
      </p>

      <p>
        Need the component package first? Follow the{" "}
        <Link href="/docs/installation">installation guide</Link>, then return here to
        connect your coding agent.
      </p>

      <PageNav pathname="/docs/mcp" />
    </article>
  );
}
