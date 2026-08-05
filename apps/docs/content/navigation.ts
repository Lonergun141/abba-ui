import { componentsByCategory } from "@abbainitiative/registry";

export interface NavItem {
  title: string;
  href: string;
  /** Shown in the filtered sidebar results. */
  summary?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const guideSections: NavSection[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Next.js", href: "/docs/nextjs" },
      { title: "React", href: "/docs/react" },
      { title: "MCP", href: "/docs/mcp" },
    ],
  },
  {
    title: "Design system",
    items: [
      { title: "Design tokens", href: "/docs/tokens" },
      { title: "Theming", href: "/docs/theming" },
      { title: "Dark mode", href: "/docs/dark-mode" },
      { title: "Accessibility", href: "/docs/accessibility" },
    ],
  },
];

const projectSection: NavSection = {
  title: "Project",
  items: [{ title: "Changelog", href: "/docs/changelog" }],
};

/** Full sidebar tree: guides, then a section per component category. */
export const navigation: NavSection[] = [
  ...guideSections,
  {
    title: "Components",
    items: [{ title: "All components", href: "/docs/components" }],
  },
  ...componentsByCategory().map((group) => ({
    title: group.category,
    items: group.items.map((component) => ({
      title: component.name,
      href: `/docs/components/${component.slug}`,
      summary: component.summary,
    })),
  })),
  projectSection,
];

/** Flattened order, used for previous/next links at the foot of each page. */
export const flatNavigation: NavItem[] = navigation.flatMap((section) => section.items);

export function getAdjacentPages(pathname: string): {
  previous?: NavItem;
  next?: NavItem;
} {
  const index = flatNavigation.findIndex((item) => item.href === pathname);
  if (index === -1) return {};
  return {
    previous: index > 0 ? flatNavigation[index - 1] : undefined,
    next: index < flatNavigation.length - 1 ? flatNavigation[index + 1] : undefined,
  };
}
