import type * as React from "react";

import { Sidebar } from "@/components/site/sidebar";

/**
 * The two-column documentation shell.
 *
 * Scoped to /docs rather than declared at the root so the landing page can run
 * full width without a sidebar it has no navigation for.
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Documentation">
        <Sidebar />
      </aside>

      <main className="main" id="main-content">
        {children}
      </main>
    </div>
  );
}
