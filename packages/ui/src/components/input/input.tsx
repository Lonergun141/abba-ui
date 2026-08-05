"use client";

import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./input.module.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "size" | "prefix"
> {
  /** Control height. Defaults to `md`. Renamed from the native `size` attribute. */
  size?: InputSize;
  /** Marks the field as failing validation. */
  invalid?: boolean;
  /** Decorative content rendered inside the leading edge. */
  prefix?: React.ReactNode;
  /** Decorative content rendered inside the trailing edge. */
  suffix?: React.ReactNode;
}

/**
 * A single-line text field.
 *
 * Renders a real `<input>`, so form association, validation, autofill and IME
 * behaviour come from the platform.
 *
 * Uncontrolled by default; pass `value` with `onChange` to control it. The
 * component never holds the value itself.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid = false, prefix, suffix, className, type = "text", ...rest },
  ref,
) {
  const field = (
    <input
      ref={ref}
      type={type}
      className={cn(
        styles.root,
        styles[size],
        // Ternaries rather than `prefix && ...`: prefix is a ReactNode, and
        // `&&` would forward a node (or a bigint) where a class is expected.
        prefix ? styles.hasPrefix : undefined,
        suffix ? styles.hasSuffix : undefined,
        className,
      )}
      // aria-invalid rather than a class: assistive technology needs to hear
      // that the field is in error, not just see a red border.
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );

  if (!prefix && !suffix) return field;

  return (
    <span className={styles.wrapper}>
      {prefix ? (
        <span className={cn(styles.affix, styles.prefix)} aria-hidden="true">
          {prefix}
        </span>
      ) : null}
      {field}
      {suffix ? (
        <span className={cn(styles.affix, styles.suffix)} aria-hidden="true">
          {suffix}
        </span>
      ) : null}
    </span>
  );
});

Input.displayName = "Input";
