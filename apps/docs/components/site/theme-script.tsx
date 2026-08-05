import type * as React from "react";

/**
 * Applies the stored theme before first paint.
 *
 * This has to be a blocking inline script in <head>. Setting the theme in an
 * effect would let the light theme paint first and then snap to dark, which is
 * the flash every themed site is judged on. `suppressHydrationWarning` on <html>
 * covers the attribute this adds before React takes over.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("abba-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "light" || stored === "dark" ? stored : (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export function ThemeScript(): React.JSX.Element {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
