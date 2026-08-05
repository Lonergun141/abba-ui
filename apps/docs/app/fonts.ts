import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

/**
 * Typefaces for the documentation site.
 *
 * The library itself downloads no webfont — it resolves `--abba-font-sans` to
 * the platform UI stack and leaves the choice to the consumer. This site is a
 * consumer, so it makes that choice and points the token at the result. The
 * whole font treatment here is the theming mechanism working, not an exception
 * to it.
 *
 * Bricolage Grotesque carries the display sizes. It is a grotesque with
 * slightly irregular terminals and a wide variable range, which reads as drawn
 * rather than defaulted — the point of a design system's own front door.
 */
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const body = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Not a variable font, so the weights have to be named.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});
