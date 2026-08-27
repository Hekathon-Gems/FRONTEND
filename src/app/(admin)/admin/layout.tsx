"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { initAuth } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    void initAuth();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    } else if (
      status === "authenticated" &&
      user &&
      user.role !== "admin" &&
      user.role !== "staff"
    ) {
      router.replace("/");
    }
  }, [status, user, router, pathname]);

  if (
    status !== "authenticated" ||
    !user ||
    (user.role !== "admin" && user.role !== "staff")
  ) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-md bg-border" />
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-bg-cream">
        <div className="mx-auto flex max-w-[1600px]">
          <AdminSidebarNav role={user.role} />
          <div className="min-w-0 flex-1 px-6 py-8 sm:px-10">{children}</div>
        </div>
      </div>
    </MotionConfig>
  );
}
