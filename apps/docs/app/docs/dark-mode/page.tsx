import { Alert } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";

export const metadata: Metadata = {
  title: "Dark mode",
  description:
    "Dark mode ships under both [data-theme='dark'] and .dark, with a blocking script to avoid a flash of the wrong theme.",
};

const SELECTORS = `/* Both selectors are shipped, so the library drops into either
   convention without your application adapting to it. */
[data-theme="dark"],
.dark {
  --abba-background: var(--abba-neutral-950);
  --abba-foreground: var(--abba-neutral-50);
  /* …the full dark token set */
}`;

const BLOCKING_SCRIPT = `// app/theme-script.tsx — a Server Component
const script = \`
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
\`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}`;

const LAYOUT = `// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning covers the attribute the script sets
    // before React takes over. Without it React warns on every load.
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

const TOGGLE = `"use client";

import { IconButton } from "@abbainitiative/ui";
import { useSyncExternalStore } from "react";

// The attribute on <html> is the store. Subscribing to it means the
// button can never disagree with the page, and there is no second
// copy of the preference to keep in sync.
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

// On the server the theme is genuinely unknown, so say so rather than
// guessing and announcing the wrong label half the time.
const getServerSnapshot = () => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <IconButton
      variant="ghost"
      aria-label={
        theme === null
          ? "Switch theme"
          : \`Switch to \${theme === "dark" ? "light" : "dark"} theme\`
      }
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        document.documentElement.style.colorScheme = next;
        localStorage.setItem("theme", next);
      }}
      icon={<ThemeIcon theme={theme} />}
    />
  );
}`;

const NEXT_THEMES = `// next-themes works without modification — its default
// attribute is class, which matches the .dark selector.
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class">{children}</ThemeProvider>

// Or, to use the data attribute instead:
<ThemeProvider attribute="data-theme">{children}</ThemeProvider>`;

const SYSTEM_ONLY = `/* No toggle at all? Follow the operating system and stop
   there. This needs no JavaScript whatsoever. */
@media (prefers-color-scheme: dark) {
  :root {
    /* Re-declare the dark token set here, or add the class
       server-side from a cookie. */
  }
}`;

export default function DarkModePage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Design system</span>
      <h1>Dark mode</h1>
      <p className="lead">
        Dark mode is the same token mechanism as{" "}
        <Link href="/docs/theming">theming</Link>, applied through a selector. The
        library ships a complete dark token set — you decide how the selector gets
        applied.
      </p>

      <h2>Both conventions are supported</h2>
      <p>
        The dark tokens are declared under <code>[data-theme=&quot;dark&quot;]</code>{" "}
        <em>and</em> <code>.dark</code>. Whichever convention your application already
        uses, it works — including alongside Tailwind&apos;s dark variant or{" "}
        <code>next-themes</code> defaults.
      </p>
      <CodeBlock code={SELECTORS} language="css" />

      <h2>Avoiding the flash</h2>
      <p>
        Applying the theme in an effect means the light theme paints first and then
        snaps to dark. It is brief, it is ugly, and it is the detail people judge a
        themed site on. The fix is a small blocking script in <code>&lt;head&gt;</code>{" "}
        that runs before first paint.
      </p>
      <CodeBlock code={BLOCKING_SCRIPT} />
      <CodeBlock code={LAYOUT} />

      <Alert tone="info" title="Why suppressHydrationWarning">
        The script mutates <code>&lt;html&gt;</code> before React hydrates, so the
        server-rendered markup and the DOM legitimately differ. The attribute tells
        React that this specific difference is intended; it does not suppress warnings
        anywhere else in the tree.
      </Alert>

      <h2>A toggle</h2>
      <p>
        Read the attribute the script already set rather than recomputing the preference
        — two sources of truth is how a toggle ends up disagreeing with the page it is
        on. Subscribing with <code>useSyncExternalStore</code> rather than copying the
        value into state also keeps the button correct if anything else changes the
        theme, and avoids a <code>setState</code> in an effect.
      </p>
      <CodeBlock code={TOGGLE} />

      <h2>Using next-themes</h2>
      <p>
        If you would rather not hand-roll it, <code>next-themes</code> works with no
        adaptation.
      </p>
      <CodeBlock code={NEXT_THEMES} />

      <h2>System preference only</h2>
      <p>
        A toggle is not compulsory. Following the operating system is a legitimate
        choice and needs no client JavaScript at all.
      </p>
      <CodeBlock code={SYSTEM_ONLY} language="css" />

      <h2>What changes in dark mode</h2>
      <ul>
        <li>
          <strong>Primary and accent step lighter.</strong> Cedar 600 on near-black is
          unreadable, so the dark set points primary at Cedar 400 and inverts the
          foreground.
        </li>
        <li>
          <strong>State colours are re-picked, not inverted.</strong> Mechanically
          inverting a red produces a cyan; each dark state colour was chosen against the
          dark background.
        </li>
        <li>
          <strong>Shadows become higher-opacity black.</strong> The warm-tinted
          light-mode shadows are invisible on a near-black surface.
        </li>
        <li>
          <strong>Surfaces separate by lightness.</strong>{" "}
          <code>--abba-background-raised</code> is lighter than the page in dark mode
          and identical to it in light mode, matching how elevation actually reads in
          each.
        </li>
      </ul>

      <h2>Testing it</h2>
      <p>
        Use the toggle in this site&apos;s header — every example on every page is
        rendered with the real components, so what you see here is what your application
        gets.
      </p>

      <PageNav pathname="/docs/dark-mode" />
    </article>
  );
}
