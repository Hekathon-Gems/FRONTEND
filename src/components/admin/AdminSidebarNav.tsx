"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Gem,
  Tags,
  ShoppingCart,
  Ticket,
  Users,
  Newspaper,
  FileText,
  Mail,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/lib/auth-client";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  { label: "Products", href: "/admin/products", icon: Gem, adminOnly: false },
  { label: "Taxonomy", href: "/admin/taxonomy", icon: Tags, adminOnly: false },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    adminOnly: false,
  },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, adminOnly: false },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
    adminOnly: false,
  },
  { label: "Blog", href: "/admin/blog", icon: Newspaper, adminOnly: false },
  {
    label: "Site Content",
    href: "/admin/content",
    icon: FileText,
    adminOnly: false,
  },
  {
    label: "Contact Inbox",
    href: "/admin/contact",
    icon: Inbox,
    adminOnly: false,
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
    adminOnly: false,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    adminOnly: true,
  },
];

export function AdminSidebarNav({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-bg-dark sticky top-0">
      <div className="px-5 py-6">
        <Link
          href="/admin"
          className="font-heading text-base tracking-[0.1em] text-text-primary-light"
        >
          GEMORA <span className="text-accent-gold">ADMIN</span>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.05em] text-text-muted-light">
          {role}
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin").map(
          (item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent-gold text-bg-dark"
                    : "text-text-muted-light hover:bg-white/5 hover:text-text-primary-light",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          },
        )}
      </div>

      <div className="space-y-1 border-t border-border-dark px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted-light hover:bg-white/5 hover:text-text-primary-light"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          View Storefront
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-danger hover:bg-danger-bg/10"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </nav>
  );
}
