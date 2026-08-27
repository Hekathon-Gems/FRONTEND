import clsx from "clsx";
import type { ReactNode } from "react";

type Tone = "success" | "info" | "warning" | "danger" | "gold";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-bg text-success",
  info: "bg-info-bg text-info",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  gold: "bg-accent-gold/10 text-accent-gold-text",
};

export function Badge({
  tone = "gold",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
