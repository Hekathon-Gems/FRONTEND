"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  once?: boolean;
}

// Scroll-reveal wrapper used across the storefront and admin dashboard.
// Plays once per element (default) so re-scrolling past a section doesn't
// keep re-triggering it.
export function FadeIn({
  children,
  delay = 0,
  y = 24,
  once = true,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
