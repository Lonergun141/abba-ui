/** Shared shapes for the component documentation registry. */

export type ComponentCategory =
  | "Layout"
  | "Typography"
  | "Actions"
  | "Forms"
  | "Data display"
  | "Feedback"
  | "Overlays";

export interface PropDef {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

export interface ExampleDef {
  /** Key used to look up the live demo in the client demo registry. */
  id: string;
  title: string;
  description?: string;
  /** Source shown in the code block, and copied by the copy button. */
  code: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  category: ComponentCategory;
  /** One line, used in navigation and the component index. */
  summary: string;
  /** A paragraph of context shown at the top of the page. */
  description: string;
  /** Named exports available from the subpath entry. */
  exports: string[];
  /**
   * Whether the component renders in a Server Component without the consumer
   * adding a client boundary.
   */
  serverSafe: boolean;
  props: PropDef[];
  examples: ExampleDef[];
  accessibility: string[];
}

export const CATEGORY_ORDER: ComponentCategory[] = [
  "Layout",
  "Typography",
  "Actions",
  "Forms",
  "Data display",
  "Feedback",
  "Overlays",
];
