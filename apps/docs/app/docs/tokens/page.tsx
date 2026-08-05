import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import {
  ScalePreview,
  TokenPreview,
  type TokenEntry,
} from "@/components/docs/token-preview";

export const metadata: Metadata = {
  title: "Design tokens",
  description:
    "The full ABBA Design System token reference: Cedar and Ember palettes, semantic roles, spacing, type, radii, elevation and motion.",
};

const CEDAR: TokenEntry[] = [
  { name: "--abba-cedar-50", value: "#edf6f3" },
  { name: "--abba-cedar-100", value: "#d2e9e2" },
  { name: "--abba-cedar-200", value: "#a6d3c7" },
  { name: "--abba-cedar-300", value: "#74b8a8" },
  { name: "--abba-cedar-400", value: "#45988a" },
  { name: "--abba-cedar-500", value: "#2a7c6e" },
  { name: "--abba-cedar-600", value: "#1f6b60" },
  { name: "--abba-cedar-700", value: "#175449" },
  { name: "--abba-cedar-800", value: "#123f38" },
  { name: "--abba-cedar-900", value: "#0d2c27" },
  { name: "--abba-cedar-950", value: "#071a17" },
];

const EMBER: TokenEntry[] = [
  { name: "--abba-ember-50", value: "#fdf3ea" },
  { name: "--abba-ember-100", value: "#f9e0c9" },
  { name: "--abba-ember-200", value: "#f0c094" },
  { name: "--abba-ember-300", value: "#e39d5f" },
  { name: "--abba-ember-400", value: "#d27e33" },
  { name: "--abba-ember-500", value: "#a85714" },
  { name: "--abba-ember-600", value: "#984e13" },
  { name: "--abba-ember-700", value: "#7a3d10" },
  { name: "--abba-ember-800", value: "#5c2e0d" },
  { name: "--abba-ember-900", value: "#3f200a" },
];

const NEUTRALS: TokenEntry[] = [
  { name: "--abba-neutral-0", value: "#ffffff" },
  { name: "--abba-neutral-25", value: "#fcfbf9" },
  { name: "--abba-neutral-50", value: "#faf9f7" },
  { name: "--abba-neutral-100", value: "#f4f2ee" },
  { name: "--abba-neutral-200", value: "#e8e4dd" },
  { name: "--abba-neutral-300", value: "#d6d0c6" },
  { name: "--abba-neutral-400", value: "#b0a89c" },
  { name: "--abba-neutral-500", value: "#857c71" },
  { name: "--abba-neutral-600", value: "#635b52" },
  { name: "--abba-neutral-700", value: "#47413a" },
  { name: "--abba-neutral-800", value: "#2e2925" },
  { name: "--abba-neutral-900", value: "#1c1815" },
  { name: "--abba-neutral-950", value: "#12100e" },
];

const SEMANTIC: TokenEntry[] = [
  { name: "--abba-primary", value: "cedar 600" },
  { name: "--abba-primary-hover", value: "cedar 700" },
  { name: "--abba-primary-active", value: "cedar 800" },
  { name: "--abba-primary-foreground", value: "neutral 0" },
  { name: "--abba-primary-subtle", value: "cedar 50" },
  { name: "--abba-primary-subtle-foreground", value: "cedar 800" },
  { name: "--abba-accent", value: "ember 500" },
  { name: "--abba-accent-hover", value: "ember 600" },
  { name: "--abba-accent-active", value: "ember 700" },
  { name: "--abba-accent-foreground", value: "neutral 0" },
  { name: "--abba-accent-subtle", value: "ember 50" },
  { name: "--abba-accent-subtle-foreground", value: "ember 800" },
];

const STATES: TokenEntry[] = [
  { name: "--abba-success", value: "#1f7a4d" },
  { name: "--abba-success-subtle", value: "#e8f5ee" },
  { name: "--abba-warning", value: "#b7791f" },
  { name: "--abba-warning-subtle", value: "#fcf3e3" },
  { name: "--abba-danger", value: "#b42318" },
  { name: "--abba-danger-subtle", value: "#fdecea" },
  { name: "--abba-info", value: "#2c6ba8" },
  { name: "--abba-info-subtle", value: "#e9f1f9" },
];

const SURFACES: TokenEntry[] = [
  { name: "--abba-background", value: "page background" },
  { name: "--abba-background-subtle", value: "recessed areas" },
  { name: "--abba-background-raised", value: "cards, menus, dialogs" },
  { name: "--abba-foreground", value: "body text" },
  { name: "--abba-muted", value: "hover fills" },
  { name: "--abba-muted-foreground", value: "secondary text" },
  { name: "--abba-border", value: "default border" },
  { name: "--abba-border-subtle", value: "hairlines" },
  { name: "--abba-border-strong", value: "emphasised border" },
  { name: "--abba-overlay", value: "dialog scrim" },
];

const SPACING: TokenEntry[] = [
  { name: "--abba-space-1", value: "0.25rem" },
  { name: "--abba-space-2", value: "0.5rem" },
  { name: "--abba-space-3", value: "0.75rem" },
  { name: "--abba-space-4", value: "1rem" },
  { name: "--abba-space-5", value: "1.25rem" },
  { name: "--abba-space-6", value: "1.5rem" },
  { name: "--abba-space-8", value: "2rem" },
  { name: "--abba-space-10", value: "2.5rem" },
  { name: "--abba-space-12", value: "3rem" },
  { name: "--abba-space-16", value: "4rem" },
  { name: "--abba-space-20", value: "5rem" },
  { name: "--abba-space-24", value: "6rem" },
];

const RADII: TokenEntry[] = [
  { name: "--abba-radius-none", value: "0" },
  { name: "--abba-radius-sm", value: "6px" },
  { name: "--abba-radius-md", value: "10px" },
  { name: "--abba-radius-lg", value: "14px" },
  { name: "--abba-radius-xl", value: "20px" },
  { name: "--abba-radius-full", value: "9999px" },
];

const TYPE_SIZES: [string, string, string][] = [
  ["--abba-font-size-xs", "0.75rem", "Captions, shortcut hints"],
  ["--abba-font-size-sm", "0.875rem", "Secondary text, dense UI"],
  ["--abba-font-size-md", "1rem", "Body copy — the default"],
  ["--abba-font-size-lg", "1.125rem", "Lead paragraphs"],
  ["--abba-font-size-xl", "1.375rem", "Section headings"],
  ["--abba-font-size-2xl", "1.75rem", "Page headings"],
  ["--abba-font-size-3xl", "2.25rem", "Page titles"],
  ["--abba-font-size-4xl", "3rem", "Display"],
];

const MOTION: [string, string, string][] = [
  ["--abba-duration-instant", "80ms", "State flips with no perceived travel"],
  ["--abba-duration-fast", "140ms", "Hover, focus, small colour changes"],
  ["--abba-duration-normal", "220ms", "Menus, popovers"],
  ["--abba-duration-slow", "320ms", "Dialogs and larger surfaces"],
  ["--abba-ease-standard", "cubic-bezier(0.2, 0, 0, 1)", "Default curve"],
  ["--abba-ease-out", "cubic-bezier(0, 0, 0.2, 1)", "Entering the screen"],
  ["--abba-ease-in", "cubic-bezier(0.4, 0, 1, 1)", "Leaving the screen"],
];

const Z_INDEX: [string, string][] = [
  ["--abba-z-base", "0"],
  ["--abba-z-raised", "10"],
  ["--abba-z-sticky", "100"],
  ["--abba-z-overlay", "1000"],
  ["--abba-z-modal", "1100"],
  ["--abba-z-popover", "1200"],
  ["--abba-z-toast", "1300"],
  ["--abba-z-tooltip", "1400"],
];

const USING_TOKENS = `/* Tokens are ordinary CSS custom properties, so your own
   styles can consume them directly. */
.myPanel {
  padding: var(--abba-space-6);
  border: 1px solid var(--abba-border-subtle);
  border-radius: var(--abba-radius-lg);
  background-color: var(--abba-background-raised);
  box-shadow: var(--abba-shadow-sm);
  color: var(--abba-foreground);
}`;

export default function TokensPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Design system</span>
      <h1>Design tokens</h1>
      <p className="lead">
        Every visual decision in ABBA UI is a CSS custom property under the{" "}
        <code>--abba-</code> prefix. Components reference tokens and never literal
        values, which is what makes <Link href="/docs/theming">theming</Link> a
        stylesheet change rather than a fork.
      </p>

      <h2>Two layers</h2>
      <p>
        Tokens come in two layers. <strong>Palette</strong> tokens name a colour —{" "}
        <code>--abba-cedar-600</code> is a specific teal and nothing more.{" "}
        <strong>Semantic</strong> tokens name a role — <code>--abba-primary</code> is
        whatever colour primary actions should be. Components only ever use the semantic
        layer. When you rebrand, you usually only need to repoint the semantic tokens.
      </p>

      <h2>Palette — Cedar</h2>
      <p>
        The brand family: a deep teal-green. <code>--abba-cedar-600</code> is the
        default primary and reaches 6.3:1 against white text, comfortably clearing WCAG
        AA.
      </p>
      <TokenPreview tokens={CEDAR} />

      <h2>Palette — Ember</h2>
      <p>
        The accent family: a warm burnt orange. <code>--abba-ember-500</code> is
        deliberately darker than a true mid-tone so it reaches 5.0:1 with white text
        instead of stalling at 4.4:1 — a mid-tone orange that <em>looks</em> right
        almost never passes.
      </p>
      <TokenPreview tokens={EMBER} />

      <h2>Palette — Neutrals</h2>
      <p>
        Warm-tinted rather than pure grey. The warm cast is a deliberate identity
        choice: it is the single most effective defence against a system reading as
        generic template output.
      </p>
      <TokenPreview tokens={NEUTRALS} />

      <h2>Semantic roles</h2>
      <p>
        These are the tokens components actually consume, and the ones to override when
        rebranding.
      </p>
      <TokenPreview tokens={SEMANTIC} />

      <h3>State colours</h3>
      <p>
        Each state has a solid pairing and a subtle pairing.{" "}
        <code>--abba-warning-foreground</code> is dark rather than white: white on amber
        cannot reach AA without pushing the hue muddy, so the system takes the dark
        foreground instead of a worse colour.
      </p>
      <TokenPreview tokens={STATES} />

      <h3>Surfaces and borders</h3>
      <TokenPreview tokens={SURFACES} />

      <h2>Spacing</h2>
      <p>
        A 4px base scale. Layout components take these as numbers —{" "}
        <code>gap=&#123;4&#125;</code> resolves to <code>var(--abba-space-4)</code> — so
        spacing stays on the scale without you writing the variable out.
      </p>
      <ScalePreview tokens={SPACING} property="width" />

      <h2>Radii</h2>
      <ScalePreview tokens={RADII} property="radius" />

      <h2>Typography</h2>
      <p>
        The library downloads no webfont. <code>--abba-font-sans</code> resolves to the
        platform UI stack; override it with your own loaded family and everything
        follows.
      </p>
      <div className="tableWrap">
        <table className="dataTable">
          <caption>Type scale</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Used for</th>
            </tr>
          </thead>
          <tbody>
            {TYPE_SIZES.map(([name, value, use]) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>{value}</td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Weights are <code>--abba-font-weight-regular</code> (400), <code>medium</code>{" "}
        (500), <code>semibold</code> (600) and <code>bold</code> (700). Line heights run{" "}
        <code>tight</code> (1.2), <code>snug</code> (1.35), <code>normal</code> (1.55)
        and <code>relaxed</code> (1.75).
      </p>

      <h2>Elevation</h2>
      <p>
        Five shadow steps, tinted warm rather than neutral black — a pure black shadow
        over a warm neutral surface reads as grey dirt. The dark theme replaces them
        with higher-opacity black, because a tinted shadow is invisible on a near-black
        background.
      </p>
      <ul>
        <li>
          <code>--abba-shadow-xs</code> — hairline lift, used on inputs
        </li>
        <li>
          <code>--abba-shadow-sm</code> — resting cards
        </li>
        <li>
          <code>--abba-shadow-md</code> — hovered cards, dropdown menus
        </li>
        <li>
          <code>--abba-shadow-lg</code> — popovers
        </li>
        <li>
          <code>--abba-shadow-xl</code> — dialogs
        </li>
      </ul>

      <h2>Motion</h2>
      <div className="tableWrap">
        <table className="dataTable">
          <caption>Duration and easing tokens</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Used for</th>
            </tr>
          </thead>
          <tbody>
            {MOTION.map(([name, value, use]) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>
                  <code>{value}</code>
                </td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Every animated component honours <code>prefers-reduced-motion</code>. Where
        motion carries meaning — the spinner — it degrades to a static state rather than
        disappearing, because the user still needs to know something is happening.
      </p>

      <h2>Z-index</h2>
      <p>
        A named scale, so overlay ordering is decided once here instead of being
        re-litigated with <code>z-index: 9999</code> in every application.
      </p>
      <div className="tableWrap">
        <table className="dataTable">
          <caption>Stacking order</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Z_INDEX.map(([name, value]) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Focus and disabled</h2>
      <ul>
        <li>
          <code>--abba-focus-ring</code>, <code>--abba-focus-ring-width</code> (3px) and{" "}
          <code>--abba-focus-ring-offset</code> (2px) — one ring treatment across every
          focusable component.
        </li>
        <li>
          <code>--abba-disabled-opacity</code> (0.55) — applied consistently so disabled
          controls read the same everywhere.
        </li>
      </ul>

      <h2>Using tokens in your own CSS</h2>
      <CodeBlock code={USING_TOKENS} language="css" />

      <PageNav pathname="/docs/tokens" />
    </article>
  );
}
