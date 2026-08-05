"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./dialog.module.css";

/**
 * A modal dialog.
 *
 * Focus trapping, focus restoration, scroll locking, Escape handling and
 * `aria-modal` semantics come from Radix. That behaviour is genuinely difficult
 * to get right and is the one place where reimplementing from scratch reliably
 * produces accessibility bugs. Everything visible — the API shape, the class
 * names, the tokens, the animation — belongs to ABBA.
 */

export interface DialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Trigger, content, and anything else the dialog composes. */
  children?: React.ReactNode;
  /** Prevent closing on outside click and Escape. */
  modal?: boolean;
}

/** Root of the dialog. Works controlled or uncontrolled. */
export function Dialog({ children, ...rest }: DialogProps): React.JSX.Element {
  return <RadixDialog.Root {...rest}>{children}</RadixDialog.Root>;
}

Dialog.displayName = "Dialog";

export type DialogTriggerProps = React.ComponentPropsWithoutRef<
  typeof RadixDialog.Trigger
>;

/**
 * Opens the dialog.
 *
 * Pass `asChild` to use your own Button as the trigger rather than nesting one
 * button inside another.
 */
export const DialogTrigger = RadixDialog.Trigger;

export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof RadixDialog.Close>;

/** Closes the dialog. Use `asChild` to wrap a Button. */
export const DialogClose = RadixDialog.Close;

export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof RadixDialog.Content
> {
  /** Maximum width. Defaults to `md`. */
  size?: DialogSize;
  /** Renders the built-in close button. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Accessible name for the built-in close button. */
  closeLabel?: string;
}

/** The dialog surface. Renders in a portal above the overlay. */
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    {
      size = "md",
      showCloseButton = true,
      closeLabel = "Close dialog",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content
          ref={ref}
          className={cn(styles.content, styles[size], className)}
          {...rest}
        >
          {children}
          {showCloseButton ? (
            <RadixDialog.Close className={styles.close} aria-label={closeLabel}>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </RadixDialog.Close>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    );
  },
);

DialogContent.displayName = "DialogContent";

export type DialogHeaderProps = React.ComponentPropsWithoutRef<"div">;

/** Groups the title and description. */
export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.header, className)} {...rest} />;
  },
);

DialogHeader.displayName = "DialogHeader";

export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof RadixDialog.Title>;

/**
 * The dialog's accessible name.
 *
 * Always render one. Radix warns in development when it is missing, because a
 * dialog with no name is announced only as "dialog".
 */
export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className, ...rest }, ref) {
    return (
      <RadixDialog.Title ref={ref} className={cn(styles.title, className)} {...rest} />
    );
  },
);

DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof RadixDialog.Description
>;

/** Supporting text, wired to `aria-describedby`. */
export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  return (
    <RadixDialog.Description
      ref={ref}
      className={cn(styles.description, className)}
      {...rest}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

export type DialogBodyProps = React.ComponentPropsWithoutRef<"div">;

/** Main scrollable content area. */
export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  function DialogBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.body, className)} {...rest} />;
  },
);

DialogBody.displayName = "DialogBody";

export type DialogFooterProps = React.ComponentPropsWithoutRef<"div">;

/** Action row, aligned to the trailing edge. */
export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.footer, className)} {...rest} />;
  },
);

DialogFooter.displayName = "DialogFooter";
