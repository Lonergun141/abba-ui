"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "../../utilities/cn";
import styles from "./tabs.module.css";

/**
 * Switches between panels of related content.
 *
 * Arrow-key navigation, roving tabindex and the `tab`/`tabpanel` relationships
 * come from Radix.
 */

export type TabsVariant = "line" | "enclosed";

const TabsVariantContext = React.createContext<TabsVariant>("line");

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /** Visual treatment of the tab list. Defaults to `line`. */
  variant?: TabsVariant;
}

/**
 * Root of the tab set. Works controlled (`value`) or uncontrolled
 * (`defaultValue`).
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = "line", className, ...rest },
  ref,
) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <RadixTabs.Root ref={ref} className={cn(styles.root, className)} {...rest} />
    </TabsVariantContext.Provider>
  );
});

Tabs.displayName = "Tabs";

export type TabsListProps = React.ComponentPropsWithoutRef<typeof RadixTabs.List>;

/**
 * Container for the triggers.
 *
 * Reads the variant from context rather than taking it as a prop, so a
 * consumer cannot set the root and the list to different treatments.
 */
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className, ...rest }, ref) {
    const variant = React.useContext(TabsVariantContext);
    return (
      <RadixTabs.List
        ref={ref}
        className={cn(styles.list, styles[variant], className)}
        {...rest}
      />
    );
  },
);

TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>;

/** A single tab. Its `value` links it to the matching panel. */
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ className, ...rest }, ref) {
    return (
      <RadixTabs.Trigger ref={ref} className={cn(styles.trigger, className)} {...rest} />
    );
  },
);

TabsTrigger.displayName = "TabsTrigger";

export type TabsPanelProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Content>;

/** Content shown when the matching trigger is active. */
export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel({ className, ...rest }, ref) {
    return (
      <RadixTabs.Content ref={ref} className={cn(styles.panel, className)} {...rest} />
    );
  },
);

TabsPanel.displayName = "TabsPanel";
