# Public MCP Surface Design

**Goal:** Make ABBA UI's MCP server discoverable on the website and installable from npm by coding agents and other projects.

## Public package flow

Publish `@abbainitiative/registry@0.1.0` before `@abbainitiative/mcp@0.1.0`. The MCP package depends on the registry package, so the registry must exist on npm before a clean `npx -y @abbainitiative/mcp` consumer check can pass. Publish with pnpm so `workspace:*` is rewritten to a concrete version in the packed manifest.

## Website surface

Add a dedicated `/docs/mcp` guide under Getting started. It will explain the MCP tools, show the `npx` command, provide copyable configurations for Claude Code, Codex, and generic MCP clients, and clarify that the server is read-only and bundled with the ABBA catalogue.

Add a compact MCP callout to the landing page near the installation CTA. It will link to `/docs/mcp` and distinguish the MCP integration from the React component package without changing the existing hero or component showcase.

Update the package README/setup references to use the published package and retain the source-run command for repository contributors.

## Verification

Run the MCP tests, typecheck, build, and packed-package inspection. Verify both npm packages with `npm view`, install the MCP package in a clean temporary directory using `npx`, run its JSON-RPC handshake, build the docs, check `/docs/mcp` and the landing page locally, then deploy and check the production routes.
