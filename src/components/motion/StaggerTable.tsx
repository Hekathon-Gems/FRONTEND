"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const ROW_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// Same idea as StaggerGrid, but emits valid <tbody>/<tr> tags so it can
// wrap admin table rows without breaking table semantics.
export function StaggerTableBody({
  children,
  ...props
}: HTMLMotionProps<"tbody">) {
  return (
    <motion.tbody
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      {...props}
    >
      {children}
    </motion.tbody>
  );
}

export function StaggerRow({ children, ...props }: HTMLMotionProps<"tr">) {
  return (
    <motion.tr variants={ROW_VARIANTS} {...props}>
      {children}
    </motion.tr>
  );
}
