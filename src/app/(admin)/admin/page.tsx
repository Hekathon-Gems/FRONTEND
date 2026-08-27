"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
  Plus,
  Inbox,
} from "lucide-react";
import { StatusPill } from "@/components/account/StatusPill";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { StaggerTableBody, StaggerRow } from "@/components/motion/StaggerTable";
import { getDashboardKpis } from "@/lib/admin-client";
import { getAdminContactSubmissions } from "@/lib/admin-client";
import { formatDate, formatPrice } from "@/lib/format";
import type { DashboardKpis } from "@/lib/admin-types";

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    getDashboardKpis().then(setKpis);
    getAdminContactSubmissions("new").then((rows) =>
      setUnreadCount(rows.length),
    );
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Store overview and quick actions.
      </p>

      {!kpis ? (
        <div className="mt-6 h-40 animate-pulse rounded-md bg-border" />
      ) : (
        <StaggerGrid className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem className="rounded-md border border-border bg-bg-white p-5">
            <div className="flex items-center gap-2 text-text-muted">
              <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-[0.05em]">
                Today&apos;s Orders
              </span>
            </div>
            <p className="mt-2 font-heading text-2xl text-text-primary-dark">
              {kpis.todayOrderCount}
            </p>
          </StaggerItem>
          <StaggerItem className="rounded-md border border-border bg-bg-white p-5">
            <div className="flex items-center gap-2 text-text-muted">
              <DollarSign className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-[0.05em]">
                Today&apos;s Revenue
              </span>
            </div>
            <p className="mt-2 font-heading text-2xl text-text-primary-dark">
              {formatPrice(kpis.todayRevenueCents)}
            </p>
          </StaggerItem>
          <StaggerItem className="rounded-md border border-border bg-bg-white p-5">
            <div className="flex items-center gap-2 text-text-muted">
              <Clock className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-[0.05em]">
                Pending Orders
              </span>
            </div>
            <p className="mt-2 font-heading text-2xl text-text-primary-dark">
              {kpis.pendingOrdersCount}
            </p>
          </StaggerItem>
          <StaggerItem className="rounded-md border border-border bg-bg-white p-5">
            <div className="flex items-center gap-2 text-text-muted">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-[0.05em]">
                Low Stock
              </span>
            </div>
            <p className="mt-2 font-heading text-2xl text-text-primary-dark">
              {kpis.lowStockCount}
            </p>
          </StaggerItem>
        </StaggerGrid>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-bg-dark px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-primary-light hover:bg-black"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-primary-dark hover:border-accent-gold"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
          View Orders
        </Link>
        <Link
          href="/admin/contact"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-primary-dark hover:border-accent-gold"
        >
          <Inbox className="h-4 w-4" strokeWidth={1.5} />
          Contact Submissions
          {unreadCount !== null && unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-danger px-2 py-0.5 text-[11px] text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Recent Orders
        </h2>
        <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <StaggerTableBody>
              {(kpis?.recentOrders ?? []).map((order) => (
                <StaggerRow
                  key={order.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-accent-gold-text underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {order.itemCount}
                  </td>
                  <td className="px-4 py-3 text-text-primary-dark">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={order.status} />
                  </td>
                </StaggerRow>
              ))}
              {kpis && kpis.recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </StaggerTableBody>
          </table>
        </div>
      </div>
    </div>
  );
}
