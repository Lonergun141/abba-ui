"use client";

import * as React from "react";

export type Theme = "light" | "dark";

/**
 * Reads the active theme from the `data-theme` attribute on <html>.
 *
 * The attribute is the source of truth — a blocking script in <head> sets it
 * before first paint, so re-deriving the preference would produce a second
 * answer that can disagree with the page. Subscribing with a MutationObserver
 * also keeps callers correct when anything else changes the theme.
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
 * a media query, neither of which exists during rendering. `null` says so, and
 * callers can fall back to something that is not wrong half the time.
 */
function getServerSnapshot(): Theme | null {
  return null;
}

export function useTheme(): Theme | null {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
