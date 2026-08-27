"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Wraps a grid/list of cards so they fade+rise in one after another the
// first time the container scrolls into view, instead of popping in at
// once. Wrap each child in <StaggerItem>.
export function StaggerGrid({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={ITEM_VARIANTS} {...props}>
      {children}
    </motion.div>
  );
}
