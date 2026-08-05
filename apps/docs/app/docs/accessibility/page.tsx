import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import { components } from "@/content/registry";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The accessibility guarantees ABBA UI makes, what it cannot do for you, and how it is tested.",
};

const AXE = `// Every component suite runs an axe pass.
it("has no axe violations", async () => {
  const { container } = render(<Alert tone="danger" title="Failed" />);
  await expect(container).toHaveNoAxeViolations();
});`;

const ICON_BUTTON = `// An icon-only button has no text to announce, so the
// accessible name is required rather than optional. TypeScript
// enforces it — omitting aria-label is a build error.
<IconButton aria-label="Delete item" icon={<TrashIcon />} />`;

const BADGE = `// Colour is not available to a screen reader. Where the tone
// carries the meaning, supply the words it stands for.
<Badge tone="danger" srLabel="Status:">Overdue</Badge>`;

const FORM_FIELD = `// FormField generates the id, links the label, joins the
// description and error into aria-describedby in reading order,
// and sets aria-invalid when there is an error.
<FormField label="Email" description="Used to sign you in." error={error}>
  <Input type="email" />
</FormField>`;

export default function AccessibilityPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Design system</span>
      <h1>Accessibility</h1>
      <p className="lead">
        Accessibility is part of each component rather than a layer applied afterwards.
        This page states what the library guarantees, what it cannot decide for you, and
        how those guarantees are verified.
      </p>

      <h2>What every component guarantees</h2>
      <ul>
        <li>
          <strong>A visible focus indicator.</strong> One ring treatment, driven by{" "}
          <code>:focus-visible</code> so it appears for keyboard users without following
          a mouse click around. It is never removed — <code>outline: none</code> with no
          replacement is the single most common accessibility regression in component
          libraries.
        </li>
        <li>
          <strong>Semantic HTML underneath.</strong> Buttons are{" "}
          <code>&lt;button&gt;</code>, links are <code>&lt;a&gt;</code>, headings are
          real heading elements. ARIA is used to describe behaviour HTML cannot express,
          not to re-implement what it already does.
        </li>
        <li>
          <strong>Keyboard operability.</strong> Anything interactive is reachable and
          operable by keyboard alone, with the interaction pattern its role implies.
        </li>
        <li>
          <strong>Contrast at WCAG AA.</strong> Every default token pairing that renders
          text clears 4.5:1, or 3:1 for large text. Borders that convey state clear 3:1
          against their surroundings.
        </li>
        <li>
          <strong>Reduced motion is honoured.</strong> Transitions collapse under{" "}
          <code>prefers-reduced-motion</code>. Where motion carries meaning, it degrades
          to a static state instead of disappearing.
        </li>
        <li>
          <strong>Decorative content is hidden.</strong> Icons that duplicate adjacent
          text are <code>aria-hidden</code>, so nothing is announced twice.
        </li>
      </ul>

      <h2>Where the API makes you do the right thing</h2>
      <p>
        The most reliable accessibility mechanism is a type error. Several components
        make the accessible choice the only one that compiles, or the only one that is
        convenient.
      </p>
      <CodeBlock code={ICON_BUTTON} />
      <CodeBlock code={BADGE} />
      <CodeBlock code={FORM_FIELD} />

      <h2>Live regions, chosen by meaning</h2>
      <p>
        <code>Alert</code> derives its ARIA role from its tone. <code>danger</code> and{" "}
        <code>warning</code> use <code>role=&quot;alert&quot;</code> with{" "}
        <code>aria-live=&quot;assertive&quot;</code>, interrupting immediately;{" "}
        <code>info</code> and <code>success</code> use{" "}
        <code>role=&quot;status&quot;</code> with{" "}
        <code>aria-live=&quot;polite&quot;</code>, waiting for a pause. Getting this
        backwards either buries a genuine error or hijacks the user mid-sentence to tell
        them something trivial.
      </p>

      <h2>What the library cannot do for you</h2>
      <ul>
        <li>
          <strong>Heading order.</strong> <code>Heading</code> separates level from
          size, so you can render an <code>h3</code> that looks large without lying
          about the document outline — but only you know the outline.
        </li>
        <li>
          <strong>Meaningful names.</strong> &ldquo;Click here&rdquo; passes every
          automated check and helps nobody.
        </li>
        <li>
          <strong>Reading and focus order.</strong> Both follow your DOM order. A layout
          that visually reorders content with CSS will read in the original order.
        </li>
        <li>
          <strong>Contrast after you retheme.</strong> Overriding tokens discards the
          tuning the defaults received. See <Link href="/docs/theming">Theming</Link>.
        </li>
        <li>
          <strong>Whether an interaction is appropriate at all.</strong> A perfectly
          implemented modal is still the wrong answer to many problems.
        </li>
      </ul>

      <h2>Behaviour borrowed deliberately</h2>
      <p>
        Focus trapping, focus restoration, roving tabindex, type-ahead and
        collision-aware positioning are delegated to Radix primitives. These are the
        patterns where hand-rolled implementations reliably ship subtle bugs — focus
        escaping a dialog behind the browser chrome, arrow keys landing on a disabled
        item, a menu opening off-screen. Radix is treated as an invisible behaviour
        layer: none of its API surfaces in ABBA&apos;s props, so it can be replaced
        without a breaking change for you.
      </p>

      <h2>How it is tested</h2>
      <p>
        All {components.length} components have unit tests covering keyboard interaction
        and ARIA relationships, plus an automated axe pass. Both run in CI, so an
        accessibility regression fails the build rather than reaching a release.
      </p>
      <CodeBlock code={AXE} />
      <p>
        The <code>color-contrast</code> rule is disabled in those runs. jsdom does no
        layout or paint, so the rule cannot evaluate and would report a false pass —
        contrast is verified against the token values instead, where it can actually be
        measured.
      </p>

      <h2>Automated testing is not enough</h2>
      <p>
        Automated tooling catches a minority of real accessibility problems. It cannot
        tell you whether a label is meaningful, whether the focus order makes sense, or
        whether an announcement arrives at a useful moment. Test with a keyboard, and
        test with a screen reader.
      </p>

      <h2>Reporting a problem</h2>
      <p>
        Accessibility bugs are treated as correctness bugs, not enhancements. Open an
        issue with the component, the assistive technology and browser, and what you
        expected to happen.
      </p>

      <PageNav pathname="/docs/accessibility" />
    </article>
  );
}
