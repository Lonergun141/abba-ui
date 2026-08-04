/**
 * Token helpers shared by the layout primitives.
 *
 * Spacing and sizing are applied as inline custom properties rather than as one
 * CSS class per scale step. A 13-step scale across five spacing props would be
 * 65 rules per component; this keeps the shipped stylesheet small and lets the
 * values stay overridable by the same `--abba-space-*` tokens everywhere else.
 */

/** Steps on the 4px spacing scale defined in `tokens.css`. */
export type SpaceToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

/** Named radius tokens. */
export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "full";

/** Named elevation tokens. */
export type ShadowToken = "none" | "xs" | "sm" | "md" | "lg" | "xl";

/** Surface background roles. */
export type SurfaceToken = "none" | "default" | "subtle" | "raised" | "muted";

export function spaceVar(token: SpaceToken | undefined): string | undefined {
  return token === undefined ? undefined : `var(--abba-space-${String(token)})`;
}

export function radiusVar(token: RadiusToken | undefined): string | undefined {
  if (token === undefined) return undefined;
  return token === "none" ? "0" : `var(--abba-radius-${token})`;
}

export function shadowVar(token: ShadowToken | undefined): string | undefined {
  if (token === undefined) return undefined;
  return token === "none" ? "none" : `var(--abba-shadow-${token})`;
}

export function surfaceVar(token: SurfaceToken | undefined): string | undefined {
  switch (token) {
    case undefined:
    case "none":
      return undefined;
    case "default":
      return "var(--abba-background)";
    case "subtle":
      return "var(--abba-background-subtle)";
    case "raised":
      return "var(--abba-background-raised)";
    case "muted":
      return "var(--abba-muted)";
  }
}
