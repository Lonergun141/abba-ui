// ABBA's compiled stylesheet must load before the site's own styles so that
// docs rules win where they deliberately override a component.
import "@abbainitiative/ui/styles.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type * as React from "react";

import { MobileNav } from "@/components/site/mobile-nav";
import { ThemeScript } from "@/components/site/theme-script";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  DOCS_URL,
  GITHUB_URL,
  NPM_URL,
  PACKAGE_NAME,
  PACKAGE_VERSION,
} from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(DOCS_URL),
  title: {
    default: "ABBA UI — ABBA Design System",
    template: "%s · ABBA UI",
  },
  description:
    "Accessible, themeable React components for React and Next.js App Router applications. No Tailwind required.",
  openGraph: {
    title: "ABBA UI",
    description:
      "Accessible, themeable React components for React and Next.js App Router applications.",
    url: DOCS_URL,
    siteName: "ABBA UI",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
};

/**
 * Root layout — a Server Component.
 *
 * Note what is not here: no "use client" directive, and the header and footer
 * chrome below render on the server. Only the two genuinely interactive pieces
 * (theme toggle, mobile nav) are client components. That split is the same one
 * the library itself makes.
 *
 * The `<main>` element belongs to each route rather than to this layout: the
 * documentation routes wrap theirs in a sidebar grid, and the landing page runs
 * full width. Both provide `#main-content` for the skip link above.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>

        <div className="shell">
          <header className="header">
            <div className="headerInner">
              <Link href="/" className="brand">
                <span className="brandMark" aria-hidden="true">
                  A
                </span>
                ABBA UI
                <span className="brandVersion">v{PACKAGE_VERSION}</span>
              </Link>

              <div className="headerSpacer" />

              <nav className="headerLinks" aria-label="Primary">
                <Link className="headerLink" href="/docs">
                  Docs
                </Link>
                <Link className="headerLink" href="/docs/components">
                  Components
                </Link>
                <Link className="headerLink" href="/docs/tokens">
                  Tokens
                </Link>
                <a
                  className="headerLink"
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm
                </a>
                <a
                  className="headerLink"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </nav>

              <ThemeToggle />
              <MobileNav />
            </div>
          </header>

          {children}

          <footer className="siteFooter">
            <div className="siteFooterInner">
              <span>
                {PACKAGE_NAME} v{PACKAGE_VERSION} · MIT licensed
              </span>
              <span>Built by the ABBA Initiative</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
