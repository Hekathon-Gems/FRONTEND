"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth-client";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/account" },
  { label: "Order History", href: "/account/orders" },
  { label: "Saved Addresses", href: "/account/addresses" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Account Settings", href: "/account/settings" },
  { label: "Change Password", href: "/account/settings/password" },
];

export function AccountSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="w-full shrink-0 lg:w-56">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  "block rounded-md px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-bg-dark text-text-primary-light"
                    : "text-text-primary-dark hover:bg-bg-cream",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-left text-sm text-danger hover:bg-danger-bg"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
