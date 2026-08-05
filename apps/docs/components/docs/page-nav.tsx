import Link from "next/link";
import type * as React from "react";

import { getAdjacentPages } from "@/content/navigation";

/** Previous/next links derived from the flattened sidebar order. */
export function PageNav({ pathname }: { pathname: string }): React.JSX.Element | null {
  const { previous, next } = getAdjacentPages(pathname);
  if (!previous && !next) return null;

  return (
    <nav className="pageNav" aria-label="Documentation pages">
      {previous ? (
        <Link className="pageNavLink" href={previous.href}>
          <span className="pageNavHint">Previous</span>
          <span className="pageNavTitle">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="pageNavLink pageNavNext" href={next.href}>
          <span className="pageNavHint">Next</span>
          <span className="pageNavTitle">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
