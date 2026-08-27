"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/account/StatusPill";
import { StaggerTableBody, StaggerRow } from "@/components/motion/StaggerTable";
import { getAdminOrders } from "@/lib/admin-client";
import { formatDate, formatPrice } from "@/lib/format";
import type { AdminOrderListResponse } from "@/lib/admin-types";
import type { OrderStatus } from "@/lib/types";

const STATUSES: { label: string; value: OrderStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

export default function AdminOrdersPage() {
  const [result, setResult] = useState<AdminOrderListResponse | null>(null);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAdminOrders({
      status: status || undefined,
      q: q || undefined,
      page: String(page),
    }).then(setResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  function handleSearchSubmit() {
    setPage(1);
    getAdminOrders({
      status: status || undefined,
      q: q || undefined,
      page: "1",
    }).then(setResult);
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">Orders</h1>
      <p className="mt-1 text-sm text-text-muted">
        View and manage customer orders.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          placeholder="Search order # or email..."
          className="h-10 min-w-[220px] flex-1 rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
        />
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | "");
            setPage(1);
          }}
          className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <StaggerTableBody key={result?.data.map((o) => o.id).join(",")}>
            {(result?.data ?? []).map((order) => (
              <StaggerRow
                key={order.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-text-primary-dark">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {order.customerName ?? order.customerEmail ?? "Guest"}
                </td>
                <td className="px-4 py-3 text-text-muted">{order.itemCount}</td>
                <td className="px-4 py-3 text-text-primary-dark">
                  {formatPrice(order.total, order.currency)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {order.paymentStatus}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-accent-gold-text underline"
                  >
                    View
                  </Link>
                </td>
              </StaggerRow>
            ))}
            {result && result.data.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No orders match these filters.
                </td>
              </tr>
            )}
          </StaggerTableBody>
        </table>
      </div>

      {result && result.meta.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-1.5 text-sm text-text-muted">
            Page {result.meta.page} of {result.meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
