import { Badge } from "@abbainitiative/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type * as React from "react";

import { Demo } from "@/components/demos/demo";
import { AccessibilitySection } from "@/components/docs/accessibility-section";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import docs from "@/components/docs/docs.module.css";
import { PageNav } from "@/components/docs/page-nav";
import { PropsTable } from "@/components/docs/props-table";
import { components, getComponent } from "@abbainitiative/registry";
import { PACKAGE_NAME } from "@/content/site";

/**
 * Every component page is generated at build time from the registry, so the
 * whole site is static — there is no request-time work to do for documentation
 * that only changes when the package does.
 */
export function generateStaticParams(): { slug: string }[] {
  return components.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};

  return {
    title: component.name,
    description: component.summary,
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  const importLine =
    component.exports.length > 3
      ? `import {\n  ${component.exports.join(",\n  ")},\n} from "${PACKAGE_NAME}";`
      : `import { ${component.exports.join(", ")} } from "${PACKAGE_NAME}";`;

  return (
    <article className="prose">
      <span className="eyebrow">{component.category}</span>
      <h1>{component.name}</h1>
      <p className="lead">{component.summary}</p>

      <div className={docs.metaRow}>
        <Badge tone={component.serverSafe ? "success" : "accent"} variant="subtle">
          {component.serverSafe ? "Server-renderable" : "Client component"}
        </Badge>
        <Badge variant="outline">
          {component.exports.length === 1
            ? "1 export"
            : `${String(component.exports.length)} exports`}
        </Badge>
      </div>

      <p>{component.description}</p>

      <h2>Import</h2>
      <CodeBlock code={importLine} />
      <p>
        Also available from the subpath entry{" "}
        <code>{`${PACKAGE_NAME}/${component.slug}`}</code>.
      </p>

      {component.serverSafe ? (
        <p>
          This component has no state and no event handlers, so it renders inside a
          Server Component without a client boundary of your own.
        </p>
      ) : (
        <p>
          This component carries its own <code>&quot;use client&quot;</code> directive.
          You can still render it from a Server Component — you simply cannot pass it a
          function prop, because functions do not serialise across the boundary.
        </p>
      )}

      <h2>Examples</h2>
      {component.examples.map((example) => (
        <ComponentPreview
          key={example.id}
          title={example.title}
          description={example.description}
          code={example.code}
        >
          <Demo id={example.id} />
        </ComponentPreview>
      ))}

      <h2>Props</h2>
      <PropsTable props={component.props} componentName={component.name} />

      <AccessibilitySection notes={component.accessibility} />

      <PageNav pathname={`/docs/components/${component.slug}`} />
    </article>
  );
}
