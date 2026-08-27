import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "outline" | "outline-light" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-bg-dark text-text-primary-light hover:bg-black",
  accent: "bg-accent-gold text-bg-dark hover:bg-accent-gold-dark",
  outline:
    "bg-transparent text-bg-dark border border-accent-gold hover:bg-accent-gold/10",
  "outline-light":
    "bg-transparent text-text-primary-light border border-white hover:bg-white/10",
  ghost: "bg-transparent text-accent-gold-text underline px-0",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:pointer-events-none";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(BASE_CLASSES, VARIANT_CLASSES[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className,
  children,
  href,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={clsx(BASE_CLASSES, VARIANT_CLASSES[variant], className)}
    >
      {children}
    </Link>
  );
}
