import { CATEGORY_ORDER, type ComponentCategory, type ComponentDoc } from "../types.js";
import { controlComponents } from "./controls.js";
import { layoutComponents } from "./layout.js";
import { surfaceComponents } from "./surfaces.js";
import { typographyComponents } from "./typography.js";

/** Every documented component, in category order. */
export const components: ComponentDoc[] = [
  ...layoutComponents,
  ...typographyComponents,
  ...controlComponents,
  ...surfaceComponents,
];

export function getComponent(slug: string): ComponentDoc | undefined {
  return components.find((component) => component.slug === slug);
}

export function componentsByCategory(): {
  category: ComponentCategory;
  items: ComponentDoc[];
}[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: components.filter((component) => component.category === category),
  })).filter((group) => group.items.length > 0);
}
