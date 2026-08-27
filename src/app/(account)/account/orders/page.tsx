"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { StatusPill } from "@/components/account/StatusPill";
import { getMyOrders } from "@/lib/orders-client";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderListResponse, OrderStatus } from "@/lib/types";

const STATUS_OPTIONS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All Orders", value: "" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [result, setResult] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders(page, status || undefined)
      .then(setResult)
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Order History
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Track and manage your orders.
      </p>

      <div className="mt-6 flex justify-end">
        <select
          value={status}
          onChange={(e) => {
            setLoading(true);
            setStatus(e.target.value as OrderStatus | "");
            setPage(1);
          }}
          className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm focus:border-accent-gold focus:outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && !result ? (
        <div className="mt-6 h-64 animate-pulse rounded-md bg-border" />
      ) : !result || result.data.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-md border border-border bg-bg-white py-16 text-center">
          <p className="font-heading text-lg text-text-primary-dark">
            You haven&apos;t placed any orders yet.
          </p>
          <LinkButton href="/gems" variant="primary" className="mt-6">
            Start Shopping
          </LinkButton>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-md border border-border bg-bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-text-primary-dark">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatDate(order.placedAt ?? order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 text-text-primary-dark">
                      {formatPrice(order.total, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
                        className="text-accent-gold-text underline"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
            <p>
              Showing {(result.meta.page - 1) * result.meta.limit + 1} to{" "}
              {Math.min(
                result.meta.page * result.meta.limit,
                result.meta.total,
              )}{" "}
              of {result.meta.total} orders
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setLoading(true);
                  setPage((p) => p - 1);
                }}
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= result.meta.totalPages}
                onClick={() => {
                  setLoading(true);
                  setPage((p) => p + 1);
                }}
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
