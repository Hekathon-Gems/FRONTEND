"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

// Drop-in replacement for a conditionally-rendered <p> status message —
// animates in/out instead of popping, used for form success/error text
// across the storefront and admin panel.
export function AnimatedMessage({
  show,
  className,
  children,
}: {
  show: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={className}
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
