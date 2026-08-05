import { getTokenGroup, type TokenDef } from "@abbainitiative/registry";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import { ScalePreview, TokenPreview } from "@/components/docs/token-preview";

export const metadata: Metadata = {
  title: "Design tokens",
  description:
    "The full ABBA Design System token reference: Cedar and Ember palettes, semantic roles, spacing, type, radii, elevation and motion.",
};

/**
 * Token data comes from @abbainitiative/registry, which is also what the MCP
 * server serves. This page had its own copy of every value; two hand-kept lists
 * of the same tokens is the arrangement that drifts, and the registry's tests
 * check it against tokens.css directly.
 */
function group(id: string): TokenDef[] {
  const found = getTokenGroup(id);
  // Throwing beats an empty section: a renamed group should fail the build,
  // not quietly render a heading with nothing under it.
  if (!found) throw new Error(`Unknown token group: ${id}`);
  return found.tokens;
}

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
      <TokenPreview tokens={group("palette-cedar")} />

      <h2>Palette — Ember</h2>
      <p>
        The accent family: a warm burnt orange. <code>--abba-ember-500</code> is
        deliberately darker than a true mid-tone so it reaches 5.0:1 with white text
        instead of stalling at 4.4:1 — a mid-tone orange that <em>looks</em> right
        almost never passes.
      </p>
      <TokenPreview tokens={group("palette-ember")} />

      <h2>Palette — Neutrals</h2>
      <p>
        Warm-tinted rather than pure grey. The warm cast is a deliberate identity
        choice: it is the single most effective defence against a system reading as
        generic template output.
      </p>
      <TokenPreview tokens={group("palette-neutral")} />

      <h2>Semantic roles</h2>
      <p>
        These are the tokens components actually consume, and the ones to override when
        rebranding.
      </p>
      <TokenPreview tokens={group("semantic")} />

      <h3>State colours</h3>
      <p>
        Each state has a solid pairing and a subtle pairing.{" "}
        <code>--abba-warning-foreground</code> is dark rather than white: white on amber
        cannot reach AA without pushing the hue muddy, so the system takes the dark
        foreground instead of a worse colour.
      </p>
      <TokenPreview tokens={group("state")} />

      <h3>Surfaces and borders</h3>
      <TokenPreview tokens={group("surface")} />

      <h2>Spacing</h2>
      <p>
        A 4px base scale. Layout components take these as numbers —{" "}
        <code>gap=&#123;4&#125;</code> resolves to <code>var(--abba-space-4)</code> — so
        spacing stays on the scale without you writing the variable out.
      </p>
      <ScalePreview tokens={group("space")} property="width" />

      <h2>Radii</h2>
      <ScalePreview tokens={group("radius")} property="radius" />

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
            {group("typography").map(({ name, value, description }) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>{value}</td>
                <td>{description}</td>
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
            {group("motion").map(({ name, value, description }) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>
                  <code>{value}</code>
                </td>
                <td>{description}</td>
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
            {group("z-index").map(({ name, value }) => (
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
