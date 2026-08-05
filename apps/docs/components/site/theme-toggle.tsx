"use client";

import { IconButton } from "@abbainitiative/ui";
import * as React from "react";

type Theme = "light" | "dark";

/**
 * Watches the `data-theme` attribute on <html>.
 *
 * The attribute is the source of truth — a blocking script in <head> sets it
 * before first paint, so re-deriving the preference here would give us a second
 * answer that can disagree with the page it is describing. A MutationObserver
 * subscription means the button also stays correct if anything else changes the
 * theme.
 */
function subscribe(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => {
    observer.disconnect();
  };
}

function getSnapshot(): Theme | null {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * On the server the theme is genuinely unknown: it depends on localStorage and
 * a media query, neither of which exists during rendering. `null` says so
 * honestly, and the button falls back to a neutral label rather than announcing
 * something that is wrong half the time.
 */
function getServerSnapshot(): Theme | null {
  return null;
}

/**
 * Switches between the light and dark token sets.
 *
 * Writes `data-theme` on <html>, which is one of the two selectors the library
 * ships dark mode under.
 */
export function ThemeToggle(): React.JSX.Element {
  const theme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = React.useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("abba-theme", next);
    } catch {
      // Private browsing can reject writes; the toggle still works for the
      // current page, it simply will not be remembered.
    }
  }, [theme]);

  return (
    <IconButton
      variant="ghost"
      onClick={toggle}
      aria-label={
        theme === null
          ? "Switch theme"
          : `Switch to ${theme === "dark" ? "light" : "dark"} theme`
      }
      icon={
        theme === "dark" ? (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" />
          </svg>
        ) : (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a7 7 0 0 0 10.8 10.8Z" />
          </svg>
        )
      }
    />
  );
}
