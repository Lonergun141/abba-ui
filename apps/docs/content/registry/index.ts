import { CATEGORY_ORDER, type ComponentCategory, type ComponentDoc } from "../types";
import { controlComponents } from "./controls";
import { layoutComponents } from "./layout";
import { surfaceComponents } from "./surfaces";
import { typographyComponents } from "./typography";

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
