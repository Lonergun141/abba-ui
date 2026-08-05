# @abbainitiative/registry

The machine-readable catalogue of the [ABBA Design System](https://abba-ui.vercel.app): component metadata and design tokens as plain typed data.

No rendering, no React, no dependencies.

```bash
pnpm add @abbainitiative/registry
```

```ts
import {
  components,
  getComponent,
  tokenGroups,
  findToken,
} from "@abbainitiative/registry";

getComponent("button")?.props;
// [{ name: "variant", type: '"primary" | "secondary" | …', defaultValue: '"primary"', … }]

findToken("--abba-primary")?.value;
// "var(--abba-cedar-600)"
```

## Who this is for

You probably want [`@abbainitiative/ui`](https://www.npmjs.com/package/@abbainitiative/ui) — the components themselves — or the local `@abbainitiative/mcp` workspace package, which serves this data to coding agents.

This package exists for building your own tooling on top: a component picker, a lint rule, a Figma sync, an internal docs page.

## What's in it

| Export                   |                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `components`             | Every component: slug, name, category, summary, description, exports, props, examples, accessibility notes |
| `getComponent(slug)`     | One component by slug                                                                                      |
| `componentsByCategory()` | Components grouped, in display order                                                                       |
| `CATEGORY_ORDER`         | The canonical category ordering                                                                            |
| `tokens`                 | Every design token, flattened                                                                              |
| `tokenGroups`            | Tokens grouped by role — palette, semantic, spacing, radii, motion…                                        |
| `getTokenGroup(id)`      | One group                                                                                                  |
| `findToken(name)`        | One token, with or without the `--abba-` prefix                                                            |

Types are exported alongside: `ComponentDoc`, `PropDef`, `ExampleDef`, `ComponentCategory`, `TokenDef`, `TokenGroup`.

## On accuracy

The token list mirrors `tokens.css` in the component library. A test in this package parses that stylesheet and fails if the two disagree, so a token renamed in CSS cannot leave this catalogue quietly describing a variable that no longer exists.

MIT © ABBA Initiative
