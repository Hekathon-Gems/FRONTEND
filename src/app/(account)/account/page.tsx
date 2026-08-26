"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, Settings } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getMyOrders } from "@/lib/orders-client";
import { getAddresses } from "@/lib/addresses-client";
import { getWishlist } from "@/lib/wishlist-client";

const CARDS = [
  {
    key: "orders",
    label: "Order History",
    href: "/account/orders",
    icon: Package,
  },
  {
    key: "addresses",
    label: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    key: "wishlist",
    label: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    key: "settings",
    label: "Account Settings",
    href: "/account/settings",
    icon: Settings,
  },
] as const;

export default function AccountDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [counts, setCounts] = useState<Record<string, number | null>>({
    orders: null,
    addresses: null,
    wishlist: null,
  });

  useEffect(() => {
    getMyOrders(1)
      .then((res) => setCounts((c) => ({ ...c, orders: res.meta.total })))
      .catch(() => {});
    getAddresses()
      .then((res) => setCounts((c) => ({ ...c, addresses: res.length })))
      .catch(() => {});
    getWishlist()
      .then((res) => setCounts((c) => ({ ...c, wishlist: res.length })))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Welcome back, {user?.firstName}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Manage your orders, addresses, and account.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {CARDS.map(({ key, label, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className="flex items-center gap-4 rounded-md border border-border bg-bg-white p-6 transition-colors hover:border-accent-gold"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-cream text-accent-gold">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-heading text-base text-text-primary-dark">
                {label}
              </p>
              {key !== "settings" && (
                <p className="mt-1 text-sm text-text-muted">
                  {counts[key] === null ? "…" : counts[key]}{" "}
                  {key === "orders"
                    ? "orders"
                    : key === "addresses"
                      ? "saved"
                      : "items"}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
