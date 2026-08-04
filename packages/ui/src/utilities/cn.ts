/**
 * Values accepted by {@link cn}. `false`, `null` and `undefined` are permitted
 * so that conditional expressions and possibly-undefined CSS Module lookups can
 * be passed through without a guard at every call site.
 */
export type ClassValue = string | number | false | null | undefined;

/**
 * Merges internal, variant, state and consumer-supplied class names into a
 * single string, dropping anything falsy and collapsing stray whitespace.
 *
 * Kept deliberately dependency-free. There is no Tailwind class conflict to
 * resolve here — ABBA styles are scoped CSS Modules — so `tailwind-merge` and
 * `clsx` would both be weight without benefit.
 *
 * @example
 * cn(styles.root, styles[variant], isActive && styles.active, className)
 */
export function cn(...values: ClassValue[]): string {
  let result = "";

  for (const value of values) {
    if (!value && value !== 0) continue;

    const part = String(value).trim();
    if (!part) continue;

    result = result ? `${result} ${part}` : part;
  }

  return result;
}
