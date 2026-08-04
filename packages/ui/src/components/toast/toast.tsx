"use client";

import * as RadixToast from "@radix-ui/react-toast";
import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./toast.module.css";

/**
 * Transient notifications.
 *
 * Radix supplies the hard parts: an ARIA live region that announces correctly,
 * a swipe-to-dismiss gesture, and the hotkey (F8) that moves focus into the
 * viewport so keyboard users can reach an action before the toast disappears.
 *
 * The public API here is a `toast()` function from `useToast()`, rather than
 * asking every caller to render and track their own Toast elements.
 */

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  /** Short headline. */
  title: React.ReactNode;
  /** Supporting detail. */
  description?: React.ReactNode;
  /** Semantic role. Defaults to `info`. */
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. Defaults to the provider's duration. */
  duration?: number;
  /** An optional single action. */
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

interface ToastContextValue {
  /** Queues a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  /** Dismisses a toast early. */
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * Access the toast queue.
 *
 * Throws when used outside ToastProvider. A silent no-op would be worse: the
 * call would look fine and simply never notify the user.
 */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToast must be used within a <ToastProvider>. Wrap your application root with it.",
    );
  }
  return context;
}

const ICON_PATHS: Record<ToastTone, React.ReactNode> = {
  info: <path d="M12 16v-5M12 8.2v.2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
  success: <path d="m8 12.5 2.8 2.8L16 9.4M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
  warning: <path d="M12 9.5v4M12 17.3v.2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
  danger: <path d="M12 8v5M12 16.3v.2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
};

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Default milliseconds before auto-dismiss. Defaults to 5000. */
  duration?: number;
  /** Corner the toasts stack in. Defaults to bottom-right via CSS. */
  label?: string;
  /** Distance in pixels a swipe must travel to dismiss. */
  swipeThreshold?: number;
}

/**
 * Provides the toast queue and renders the viewport.
 *
 * Mount once, near the application root.
 */
export function ToastProvider({
  children,
  duration = 5000,
  label = "Notifications",
  swipeThreshold = 50,
}: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) =>
      current.map((item) => (item.id === id ? { ...item, open: false } : item)),
    );
  }, []);

  const toast = React.useCallback((options: ToastOptions): string => {
    // crypto.randomUUID is available in every browser this library supports and
    // in Node 19+, so the ids are unique without pulling in a dependency.
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...options, id, open: true }]);
    return id;
  }, []);

  // Drop closed toasts once their exit animation has finished, so the array
  // does not grow without bound over a long session.
  const handleOpenChange = React.useCallback((id: string, open: boolean) => {
    if (open) return;
    setToasts((current) =>
      current.map((item) => (item.id === id ? { ...item, open: false } : item)),
    );
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 250);
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({ toast, dismiss }),
    [toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider
        duration={duration}
        label={label}
        swipeDirection="right"
        swipeThreshold={swipeThreshold}
      >
        {children}

        {toasts.map((item) => {
          const tone = item.tone ?? "info";
          return (
            <RadixToast.Root
              key={item.id}
              open={item.open}
              duration={item.duration}
              onOpenChange={(open) => {
                handleOpenChange(item.id, open);
              }}
              className={cn(styles.root, styles[tone])}
            >
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                {ICON_PATHS[tone]}
              </svg>

              <div className={styles.content}>
                <RadixToast.Title className={styles.title}>
                  {item.title}
                </RadixToast.Title>
                {item.description ? (
                  <RadixToast.Description className={styles.description}>
                    {item.description}
                  </RadixToast.Description>
                ) : null}
                {item.action ? (
                  <RadixToast.Action
                    // altText is what a screen reader offers when the toast is
                    // announced but the button cannot be reached in time.
                    altText={item.action.label}
                    className={styles.action}
                    onClick={item.action.onClick}
                  >
                    {item.action.label}
                  </RadixToast.Action>
                ) : null}
              </div>

              <RadixToast.Close className={styles.close} aria-label="Dismiss">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}

        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = "ToastProvider";
