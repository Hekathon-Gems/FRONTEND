"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { initAuth } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { AccountSidebarNav } from "@/components/account/AccountSidebarNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    void initAuth();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-md bg-border" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-10 lg:flex-row">
        <AccountSidebarNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
