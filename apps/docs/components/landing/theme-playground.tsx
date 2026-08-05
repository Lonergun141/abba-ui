"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormField,
  Heading,
  Inline,
  Input,
  Stack,
  Text,
} from "@abbainitiative/ui";
import * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { useTheme } from "@/components/site/use-theme";
import styles from "./landing.module.css";

/**
 * A working theme, applied to real components.
 *
 * The controls write CSS custom properties onto the wrapper below, and every
 * component inside picks them up through the cascade. That is not a simulation
 * of theming — it is the whole mechanism, running on this page. The CSS shown
 * underneath is what you would paste into your own stylesheet to keep it.
 */

type Vars = Record<string, string>;

interface Accent {
  id: string;
  name: string;
  /** Swatch colour for the control. */
  swatch: string;
  /**
   * Overrides per theme. A colour that is legible on white is not legible on
   * near-black, so an accent needs both sets — a single palette applied to both
   * is the most common way a retheme ends up unreadable in dark mode.
   */
  light: Vars;
  dark: Vars;
}

const ACCENTS: Accent[] = [
  {
    id: "cedar",
    name: "Cedar",
    swatch: "#1f6b60",
    light: {},
    dark: {},
  },
  {
    id: "indigo",
    name: "Indigo",
    swatch: "#4338ca",
    light: {
      "--abba-primary": "#4338ca",
      "--abba-primary-hover": "#3730a3",
      "--abba-primary-active": "#312e81",
      "--abba-primary-subtle": "#eef2ff",
      "--abba-primary-subtle-foreground": "#312e81",
      "--abba-focus-ring": "#a5b4fc",
    },
    dark: {
      "--abba-primary": "#a5b4fc",
      "--abba-primary-hover": "#c7d2fe",
      "--abba-primary-active": "#e0e7ff",
      "--abba-primary-foreground": "#1e1b4b",
      "--abba-primary-subtle": "#1e1b4b",
      "--abba-primary-subtle-foreground": "#c7d2fe",
      "--abba-focus-ring": "#6366f1",
    },
  },
  {
    id: "plum",
    name: "Plum",
    swatch: "#86198f",
    light: {
      "--abba-primary": "#86198f",
      "--abba-primary-hover": "#701a75",
      "--abba-primary-active": "#4a044e",
      "--abba-primary-subtle": "#fdf4ff",
      "--abba-primary-subtle-foreground": "#701a75",
      "--abba-focus-ring": "#f0abfc",
    },
    dark: {
      "--abba-primary": "#f0abfc",
      "--abba-primary-hover": "#f5d0fe",
      "--abba-primary-active": "#fae8ff",
      "--abba-primary-foreground": "#4a044e",
      "--abba-primary-subtle": "#4a044e",
      "--abba-primary-subtle-foreground": "#f5d0fe",
      "--abba-focus-ring": "#c026d3",
    },
  },
  {
    id: "ink",
    name: "Ink",
    swatch: "#27272a",
    light: {
      "--abba-primary": "#27272a",
      "--abba-primary-hover": "#18181b",
      "--abba-primary-active": "#09090b",
      "--abba-primary-subtle": "#f4f4f5",
      "--abba-primary-subtle-foreground": "#27272a",
      "--abba-focus-ring": "#a1a1aa",
    },
    dark: {
      "--abba-primary": "#e4e4e7",
      "--abba-primary-hover": "#f4f4f5",
      "--abba-primary-active": "#fafafa",
      "--abba-primary-foreground": "#18181b",
      "--abba-primary-subtle": "#27272a",
      "--abba-primary-subtle-foreground": "#e4e4e7",
      "--abba-focus-ring": "#71717a",
    },
  },
];

interface Corners {
  id: string;
  name: string;
  /** Radii are the same in both themes, so there is only one set. */
  vars: Vars;
}

const CORNERS: Corners[] = [
  { id: "soft", name: "Soft", vars: {} },
  {
    id: "square",
    name: "Square",
    vars: {
      "--abba-radius-sm": "2px",
      "--abba-radius-md": "2px",
      "--abba-radius-lg": "3px",
      "--abba-radius-xl": "4px",
    },
  },
  {
    id: "pill",
    name: "Pill",
    vars: {
      "--abba-radius-sm": "9999px",
      "--abba-radius-md": "9999px",
      "--abba-radius-lg": "22px",
      "--abba-radius-xl": "28px",
    },
  },
];

function block(selector: string, vars: Vars): string {
  const entries = Object.entries(vars);
  if (entries.length === 0) return "";
  const body = entries.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}`;
}

/**
 * Builds the stylesheet a reader would copy.
 *
 * Radii sit in `:root` only — they do not change between themes, and repeating
 * them in the dark block would suggest they need to.
 */
function toCss(accent: Accent, corners: Corners): string {
  const blocks = [
    block(":root", { ...accent.light, ...corners.vars }),
    block('[data-theme="dark"]', accent.dark),
  ].filter(Boolean);

  if (blocks.length === 0) {
    return `/* Cedar and Soft are what the package ships.
   Pick another accent or corner style to see the CSS. */`;
  }

  return blocks.join("\n\n");
}

export function ThemePlayground(): React.JSX.Element {
  const [accentId, setAccentId] = React.useState("cedar");
  const [cornersId, setCornersId] = React.useState("soft");
  const theme = useTheme();

  const accent = ACCENTS.find((item) => item.id === accentId) ?? ACCENTS[0]!;
  const corners = CORNERS.find((item) => item.id === cornersId) ?? CORNERS[0]!;

  // Before hydration the theme is unknown; the light set is the safe guess
  // because it matches what the server rendered.
  const vars = {
    ...(theme === "dark" ? accent.dark : accent.light),
    ...corners.vars,
  };

  return (
    <div className={styles.playground}>
      <div className={styles.controls}>
        <div className={styles.controlGroup} role="group" aria-label="Accent colour">
          <span className={styles.controlLabel}>Accent</span>
          <div className={styles.swatches}>
            {ACCENTS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={styles.swatch}
                aria-pressed={accentId === option.id}
                onClick={() => {
                  setAccentId(option.id);
                }}
              >
                <span
                  className={styles.swatchChip}
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden="true"
                />
                {option.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup} role="group" aria-label="Corner style">
          <span className={styles.controlLabel}>Corners</span>
          <div className={styles.swatches}>
            {CORNERS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={styles.swatch}
                aria-pressed={cornersId === option.id}
                onClick={() => {
                  setCornersId(option.id);
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.playgroundBody}>
        {/*
          The overrides land here, on an ordinary element. Custom properties
          inherit, so every component below adopts them — which is why a theme
          can be scoped to a subtree rather than declared globally.
        */}
        <div className={styles.preview} style={vars}>
          <Card variant="elevated">
            <CardHeader>
              <Heading level={3} size="md">
                Invite a teammate
              </Heading>
              <Text size="sm" tone="muted">
                They&apos;ll get access to this workspace.
              </Text>
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                <FormField
                  label="Email address"
                  description="They can change this later."
                >
                  <Input type="email" placeholder="you@example.com" />
                </FormField>
                <Inline gap={2}>
                  <Badge tone="primary">Admin</Badge>
                  <Badge tone="success" dot>
                    Active
                  </Badge>
                  <Badge tone="neutral" variant="outline">
                    Read only
                  </Badge>
                </Inline>
              </Stack>
            </CardBody>
            <CardFooter divided>
              <Button size="sm">Send invite</Button>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
            </CardFooter>
          </Card>

          <Alert tone="info" title="Seats remaining">
            You can invite four more people on your current plan.
          </Alert>
        </div>

        <div className={styles.playgroundCode}>
          <p className={styles.playgroundCodeLabel}>
            Paste this into your stylesheet to keep it.
          </p>
          <CodeBlock
            code={toCss(accent, corners)}
            language="css"
            copyLabel="Copy CSS"
          />
        </div>
      </div>
    </div>
  );
}
