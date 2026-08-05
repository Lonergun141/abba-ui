import { Badge } from "@abbainitiative/ui";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { PageNav } from "@/components/docs/page-nav";
import { components } from "@/content/registry";
import { GITHUB_URL, PACKAGE_VERSION } from "@/content/site";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release history and the versioning policy for @abbainitiative/ui.",
};

const CHANGESET = `# Contributors add a changeset alongside their change:
pnpm changeset

# CI opens a release PR; merging it versions and publishes.`;

export default function ChangelogPage(): React.JSX.Element {
  return (
    <article className="prose">
      <span className="eyebrow">Project</span>
      <h1>Changelog</h1>
      <p className="lead">
        Release history for <code>@abbainitiative/ui</code>. The authoritative record is{" "}
        <a href={`${GITHUB_URL}/blob/main/packages/ui/CHANGELOG.md`}>
          CHANGELOG.md in the repository
        </a>
        , which Changesets generates from the changeset files in each pull request.
      </p>

      <h2>
        {PACKAGE_VERSION} <Badge tone="primary">Initial release</Badge>
      </h2>
      <ul>
        <li>
          {components.length} components across layout, typography, actions, forms, data
          display, feedback and overlays.
        </li>
        <li>
          Cedar &amp; Ember token system with a complete dark theme under both{" "}
          <code>[data-theme=&quot;dark&quot;]</code> and <code>.dark</code>.
        </li>
        <li>
          Per-component <code>&quot;use client&quot;</code> boundaries, never at the
          package root, with per-component chunks and an explicit <code>exports</code>{" "}
          map.
        </li>
        <li>
          A single compiled stylesheet — no Tailwind, PostCSS configuration or
          build-step coupling required in consuming applications.
        </li>
        <li>Unit, interaction and automated axe tests for every component.</li>
      </ul>

      <h2>Versioning policy</h2>
      <p>
        The package follows semantic versioning. While the major version is{" "}
        <code>0</code>, minor releases may contain breaking changes; each one is
        documented in the changelog with the migration required.
      </p>
      <ul>
        <li>
          <strong>Patch</strong> — bug fixes, and visual corrections that do not change
          layout.
        </li>
        <li>
          <strong>Minor</strong> — new components, new props, new tokens. Existing code
          keeps working.
        </li>
        <li>
          <strong>Major</strong> — removed or renamed props, changed default behaviour,
          removed tokens, or a raised React peer range.
        </li>
      </ul>

      <h3>What counts as breaking</h3>
      <p>
        Class names are not part of the public API. They are content-hashed and change
        between builds, so styling against them will break without a major version bump.
        Use{" "}
        <Link href="/docs/theming">
          tokens or the <code>className</code> prop
        </Link>{" "}
        instead. Token names <em>are</em> public: removing or renaming one is a breaking
        change.
      </p>

      <h2>How releases are made</h2>
      <CodeBlock code={CHANGESET} language="bash" />
      <p>
        Every change that affects the published package ships with a changeset declaring
        its bump type. CI accumulates them into a release pull request; merging that
        request versions the package, writes the changelog and publishes to npm with
        provenance.
      </p>

      <PageNav pathname="/docs/changelog" />
    </article>
  );
}
