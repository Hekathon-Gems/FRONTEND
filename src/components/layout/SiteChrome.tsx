"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

// The Admin Panel is its own application shell (see (admin)/admin/layout.tsx)
// and must not carry the public storefront's header/footer/cart chrome.
//
// Note: route-level page transitions (wrapping {children} in
// AnimatePresence keyed by pathname) were tried here and reverted — with
// this Next.js App Router setup it caused the incoming route's Server
// Component tree to mount multiple times during the exit/enter handoff,
// silently resetting form state (reproduced on /checkout). Everything else
// in this app animates at the component level instead, which doesn't have
// that failure mode.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </MotionConfig>
  );
}
