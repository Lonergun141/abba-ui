/**
 * The machine-readable catalogue of the ABBA Design System.
 *
 * Component metadata and design tokens as plain typed data, with no rendering
 * and no dependencies. The documentation site builds its pages from this, and
 * `@abbainitiative/mcp` serves it to coding agents — so both describe the same
 * component set rather than drifting into two accounts of it.
 */

export {
  CATEGORY_ORDER,
  type ComponentCategory,
  type ComponentDoc,
  type ExampleDef,
  type PropDef,
} from "./types.js";

export { components, componentsByCategory, getComponent } from "./components/index.js";

export {
  findToken,
  getTokenGroup,
  type TokenDef,
  type TokenGroup,
  tokenGroups,
  tokens,
} from "./tokens.js";
