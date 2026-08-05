import type { ComponentDoc, TokenDef, TokenGroup } from "@abbainitiative/registry";

/**
 * Markdown formatters for tool results.
 *
 * Tool output is read by a model, so it is written for one: the facts it needs
 * to produce correct code, in a shape it can quote from, with no decoration.
 * Prop tables and example code matter far more than prose.
 */

export const PACKAGE_NAME = "@abbainitiative/ui";

export function importLine(component: ComponentDoc): string {
  return component.exports.length > 3
    ? `import {\n  ${component.exports.join(",\n  ")},\n} from "${PACKAGE_NAME}";`
    : `import { ${component.exports.join(", ")} } from "${PACKAGE_NAME}";`;
}

function boundaryNote(component: ComponentDoc): string {
  return component.serverSafe
    ? "Renders in a React Server Component with no client boundary of your own."
    : 'Carries its own "use client". You can still render it from a Server Component, but you cannot pass it a function prop.';
}

/** One line per component — what a model needs to choose between them. */
export function formatComponentSummary(component: ComponentDoc): string {
  return `- **${component.name}** (${component.category}) — ${component.summary} Exports: ${component.exports.join(", ")}.`;
}

export function formatComponentList(list: ComponentDoc[]): string {
  if (list.length === 0) {
    return "No components matched. Call list_components with no arguments to see the full set.";
  }
  return list.map(formatComponentSummary).join("\n");
}

/**
 * Escapes pipes for a markdown table cell.
 *
 * Nearly every prop type here is a string union — `"sm" | "md" | "lg"` — and an
 * unescaped pipe splits the row into extra columns, so the table renders as
 * nonsense and the model reads the wrong type against the wrong prop.
 */
function cell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function formatProps(component: ComponentDoc): string {
  if (component.props.length === 0) {
    return `${component.name} takes no props of its own. It accepts the native attributes of the element it renders.`;
  }

  const rows = component.props.map((prop) => {
    const required = prop.required === true ? " **(required)**" : "";
    const fallback = prop.defaultValue ?? "—";
    return `| \`${cell(prop.name)}\`${required} | \`${cell(prop.type)}\` | \`${cell(fallback)}\` | ${cell(prop.description)} |`;
  });

  return [
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    "All native attributes of the underlying element are also accepted and forwarded.",
  ].join("\n");
}

function formatExamples(component: ComponentDoc): string {
  if (component.examples.length === 0) return "";

  return component.examples
    .map((example) => {
      const description = example.description ? `${example.description}\n\n` : "";
      return `### ${example.title}\n\n${description}\`\`\`tsx\n${example.code}\n\`\`\``;
    })
    .join("\n\n");
}

/** The full record for one component. */
export function formatComponent(component: ComponentDoc): string {
  const sections = [
    `# ${component.name}`,
    `**Category:** ${component.category}`,
    `**Client boundary:** ${boundaryNote(component)}`,
    "",
    component.description,
    "",
    "## Import",
    `\`\`\`tsx\n${importLine(component)}\n\`\`\``,
    `Also available from the subpath \`${PACKAGE_NAME}/${component.slug}\`.`,
    "",
    "## Props",
    formatProps(component),
  ];

  const examples = formatExamples(component);
  if (examples) sections.push("", "## Examples", examples);

  if (component.accessibility.length > 0) {
    sections.push(
      "",
      "## Accessibility",
      component.accessibility.map((note) => `- ${note}`).join("\n"),
    );
  }

  sections.push(
    "",
    `Docs: https://abba-ui.vercel.app/docs/components/${component.slug}`,
  );

  return sections.join("\n");
}

export function formatTokenGroup(group: TokenGroup): string {
  const rows = group.tokens.map((token) => {
    const description = token.description ? ` — ${token.description}` : "";
    return `| \`${token.name}\` | \`${token.value}\`${description} |`;
  });

  return [
    `## ${group.title}`,
    "",
    group.description,
    "",
    "| Token | Value |",
    "| --- | --- |",
    ...rows,
  ].join("\n");
}

export function formatToken(token: TokenDef): string {
  const description = token.description ? `\n\n${token.description}` : "";
  return `\`${token.name}\`: \`${token.value}\`${description}`;
}
