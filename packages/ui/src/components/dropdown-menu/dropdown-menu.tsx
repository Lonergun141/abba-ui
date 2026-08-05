"use client";

import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./dropdown-menu.module.css";

/**
 * A menu of actions launched from a button.
 *
 * Roving focus, type-ahead, arrow-key navigation, collision-aware positioning
 * and focus restoration come from Radix. The API, styling and tokens are ABBA's.
 */

export interface DropdownMenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

/** Root of the menu. Works controlled or uncontrolled. */
export function DropdownMenu({
  children,
  ...rest
}: DropdownMenuProps): React.JSX.Element {
  return <RadixMenu.Root {...rest}>{children}</RadixMenu.Root>;
}

DropdownMenu.displayName = "DropdownMenu";

export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof RadixMenu.Trigger
>;

/** Opens the menu. Use `asChild` to wrap your own Button. */
export const DropdownMenuTrigger = RadixMenu.Trigger;

export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<
  typeof RadixMenu.Content
>;

/** The menu surface. Renders in a portal and repositions to avoid the viewport edge. */
export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent({ className, sideOffset = 6, ...rest }, ref) {
  return (
    <RadixMenu.Portal>
      <RadixMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(styles.content, className)}
        {...rest}
      />
    </RadixMenu.Portal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<
  typeof RadixMenu.Item
> {
  /** Styles the item as a destructive action. */
  tone?: "default" | "danger";
}

/** A single actionable row. */
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ tone = "default", className, ...rest }, ref) {
    return (
      <RadixMenu.Item
        ref={ref}
        className={cn(styles.item, tone === "danger" && styles.danger, className)}
        {...rest}
      />
    );
  },
);

DropdownMenuItem.displayName = "DropdownMenuItem";

export type DropdownMenuLabelProps = React.ComponentPropsWithoutRef<
  typeof RadixMenu.Label
>;

/** A non-interactive group heading. */
export const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(function DropdownMenuLabel({ className, ...rest }, ref) {
  return (
    <RadixMenu.Label ref={ref} className={cn(styles.label, className)} {...rest} />
  );
});

DropdownMenuLabel.displayName = "DropdownMenuLabel";

export type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<
  typeof RadixMenu.Separator
>;

/** A dividing rule between groups of items. */
export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return (
    <RadixMenu.Separator
      ref={ref}
      className={cn(styles.separator, className)}
      {...rest}
    />
  );
});

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export type DropdownMenuShortcutProps = React.ComponentPropsWithoutRef<"span">;

/**
 * Keyboard hint aligned to the trailing edge of an item.
 *
 * Hidden from assistive technology: the shortcut is a visual reminder, and
 * announcing "Ctrl K" after every item name is noise.
 */
export const DropdownMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  DropdownMenuShortcutProps
>(function DropdownMenuShortcut({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(styles.shortcut, className)}
      {...rest}
    />
  );
});

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

/** Groups related items for assistive technology. */
export const DropdownMenuGroup = RadixMenu.Group;
