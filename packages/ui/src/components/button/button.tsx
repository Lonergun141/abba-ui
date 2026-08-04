"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../../utilities/cn";
import { Spinner } from "../spinner/spinner";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Visual weight of the button. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Control height and typography. Defaults to `md`. */
  size?: ButtonSize;
  /**
   * Replaces the rendered `<button>` with the single child element, merging
   * props onto it. Use for links that should look like buttons:
   * `<Button asChild><Link href="/x">Go</Link></Button>`.
   */
  asChild?: boolean;
  /** Shows a spinner, hides the label, and blocks interaction. */
  loading?: boolean;
  /** Accessible description of what is loading. */
  loadingLabel?: string;
  /** Element rendered before the label. Hidden from assistive technology. */
  leftIcon?: React.ReactNode;
  /** Element rendered after the label. Hidden from assistive technology. */
  rightIcon?: React.ReactNode;
  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;
}

/**
 * The primary action control.
 *
 * Renders a real `<button>` so that form submission, Enter/Space activation and
 * the disabled state come from the platform rather than from re-implemented
 * event handlers.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    asChild = false,
    loading = false,
    loadingLabel = "Loading",
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled = false,
    className,
    children,
    type,
    ...rest
  },
  ref,
) {
  const Component = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      className={cn(
        styles.root,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        loading && styles.loadingRoot,
        className,
      )}
      // A button inside a form defaults to `submit` in HTML, which surprises
      // people often enough that the explicit default is worth it.
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinnerSlot}>
          <Spinner size={size === "lg" ? "md" : "sm"} label={loadingLabel} />
        </span>
      ) : null}
      {leftIcon ? (
        <span aria-hidden="true" data-abba-icon="left">
          {leftIcon}
        </span>
      ) : null}
      {/*
        Slottable must wrap `children` itself. Wrapping a <span> around them
        instead makes Slot merge the button's props onto that span and leave the
        consumer's element unstyled. The label span is therefore added only when
        we own the rendered element.
      */}
      <Slottable>
        {asChild ? children : <span className={styles.label}>{children}</span>}
      </Slottable>
      {rightIcon ? (
        <span aria-hidden="true" data-abba-icon="right">
          {rightIcon}
        </span>
      ) : null}
    </Component>
  );
});

Button.displayName = "Button";
