"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@abbainitiative/ui";
import * as React from "react";

import { Sidebar } from "./sidebar";
import styles from "./mobile-nav.module.css";

/**
 * Navigation for narrow viewports.
 *
 * Deliberately built on ABBA's own Dialog rather than a bespoke drawer: the
 * docs site is the library's first consumer, and this gets focus trapping,
 * Escape handling and scroll locking for free — the same behaviour any
 * application would get.
 */
export function MobileNav(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.trigger}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <IconButton
            variant="ghost"
            aria-label="Open navigation"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
        </DialogTrigger>
        <DialogContent size="sm" className={styles.panel}>
          <DialogHeader>
            <DialogTitle>Documentation</DialogTitle>
          </DialogHeader>
          {/* Closing on navigation is the behaviour people expect from a
              mobile menu; without it the panel stays over the new page. */}
          <Sidebar
            onNavigate={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
