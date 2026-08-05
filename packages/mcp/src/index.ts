#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./server.js";

/**
 * Entry point for the stdio server.
 *
 * This module exists to be executed, not imported — the package's `.` export
 * points at ./server, so nothing has to guess whether it is being run or
 * required.
 *
 * Nothing may be written to stdout other than protocol messages: stdout *is*
 * the transport, and a stray `console.log` corrupts the stream in a way that
 * surfaces as an unexplained client disconnect. Diagnostics go to stderr.
 */
async function main(): Promise<void> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  process.stderr.write(
    `abba-ui-mcp failed to start: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
