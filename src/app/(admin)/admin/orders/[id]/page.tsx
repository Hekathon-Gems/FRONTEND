"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/account/StatusPill";
import {
  getAdminOrder,
  updateOrderStatus,
  refundOrder,
} from "@/lib/admin-client";
import { useAuthStore } from "@/store/auth-store";
import { formatDate, formatPrice } from "@/lib/format";
import type { AdminOrderDetail } from "@/lib/admin-types";

const NEXT_STATUS: Record<string, string[]> = {
  processing: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered", "cancelled", "refunded"],
  delivered: ["refunded"],
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refunding, setRefunding] = useState(false);

  function load() {
    getAdminOrder(params.id).then(setOrder);
  }

  useEffect(load, [params.id]);

  async function handleStatusSubmit() {
    if (!newStatus) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateOrderStatus(params.id, {
        status: newStatus,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
        note: note || undefined,
      });
      setNewStatus("");
      setTrackingNumber("");
      setCarrier("");
      setNote("");
      load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update this order.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRefund() {
    setRefunding(true);
    setRefundError(null);
    try {
      await refundOrder(params.id, {
        amount: refundAmount
          ? Math.round(Number(refundAmount) * 100)
          : undefined,
        reason: refundReason || undefined,
      });
      setRefundAmount("");
      setRefundReason("");
      load();
    } catch (err) {
      setRefundError(err instanceof Error ? err.message : "Refund failed.");
    } finally {
      setRefunding(false);
    }
  }

  if (!order)
    return <div className="h-64 animate-pulse rounded-md bg-border" />;

  const allowedNext = NEXT_STATUS[order.status] ?? [];

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/admin/orders")}
        className="inline-flex items-center gap-1.5 text-sm text-accent-gold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Orders
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Placed {formatDate(order.placedAt ?? order.createdAt)}
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Items
            </h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-3 text-sm"
                >
                  <span className="text-text-primary-dark">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium text-text-primary-dark">
                    {formatPrice(item.lineTotal, order.currency)}
                  </span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Subtotal</dt>
                <dd className="text-text-primary-dark">
                  {formatPrice(order.subtotal, order.currency)}
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-text-muted">Discount</dt>
                  <dd className="text-success">
                    -{formatPrice(order.discount, order.currency)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-text-muted">Shipping</dt>
                <dd className="text-text-primary-dark">
                  {order.shipping === 0
                    ? "Free"
                    : formatPrice(order.shipping, order.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Tax</dt>
                <dd className="text-text-primary-dark">
                  {formatPrice(order.tax, order.currency)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-text-primary-dark">
                <dt>Total</dt>
                <dd>{formatPrice(order.total, order.currency)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Status History
            </h2>
            <div className="mt-4 space-y-3">
              {order.statusHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between text-sm"
                >
                  <div>
                    <p className="font-medium capitalize text-text-primary-dark">
                      {entry.status.replace("_", " ")}
                    </p>
                    {entry.note && (
                      <p className="text-text-muted">{entry.note}</p>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-xs text-text-muted">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
              ))}
              {order.statusHistory.length === 0 && (
                <p className="text-sm text-text-muted">No history yet.</p>
              )}
            </div>
          </div>

          {allowedNext.length > 0 && (
            <div className="rounded-md border border-border bg-bg-white p-6">
              <h2 className="font-heading text-lg text-text-primary-dark">
                Update Status
              </h2>
              {error && (
                <p className="mt-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm"
                >
                  <option value="">Select new status…</option>
                  {allowedNext.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {newStatus === "shipped" && (
                  <>
                    <input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Tracking Number*"
                      className="h-10 rounded-sm border border-border bg-bg-white px-3 text-sm"
                    />
                    <input
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="Carrier"
                      className="h-10 rounded-sm border border-border bg-bg-white px-3 text-sm"
                    />
                  </>
                )}
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Internal note (optional)"
                  className="h-10 rounded-sm border border-border bg-bg-white px-3 text-sm sm:col-span-2"
                />
              </div>
              <Button
                variant="primary"
                className="mt-4"
                onClick={handleStatusSubmit}
                disabled={!newStatus || submitting}
              >
                Update Status
              </Button>
            </div>
          )}

          {role === "admin" && order.paymentStatus !== "refunded" && (
            <div className="rounded-md border border-border bg-bg-white p-6">
              <h2 className="font-heading text-lg text-text-primary-dark">
                Refund
              </h2>
              {refundError && (
                <p className="mt-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
                  {refundError}
                </p>
              )}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="number"
                  step={0.01}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={`Amount (leave blank for full ${formatPrice(order.total, order.currency)})`}
                  className="h-10 rounded-sm border border-border bg-bg-white px-3 text-sm"
                />
                <input
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="h-10 rounded-sm border border-border bg-bg-white px-3 text-sm"
                />
              </div>
              <Button
                variant="outline"
                className="mt-4 border-danger text-danger"
                onClick={handleRefund}
                disabled={refunding}
              >
                {refunding ? "Processing…" : "Issue Refund"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Customer
            </h2>
            <p className="mt-3 text-sm text-text-primary-dark">
              {order.customer.name ?? "Guest"}
            </p>
            <p className="text-sm text-text-muted">{order.customer.email}</p>
            {order.customer.phone && (
              <p className="text-sm text-text-muted">{order.customer.phone}</p>
            )}
            {order.customer.id && (
              <Link
                href={`/admin/customers/${order.customer.id}`}
                className="mt-2 inline-block text-sm text-accent-gold hover:underline"
              >
                View Customer Profile →
              </Link>
            )}
          </div>

          {order.shippingAddress && (
            <div className="rounded-md border border-border bg-bg-white p-6">
              <h2 className="font-heading text-lg text-text-primary-dark">
                Shipping Address
              </h2>
              <p className="mt-3 text-sm text-text-primary-dark">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-sm text-text-muted">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2
                  ? `, ${order.shippingAddress.addressLine2}`
                  : ""}
              </p>
              <p className="text-sm text-text-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-text-muted">
                {order.shippingAddress.country}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {order.shippingAddress.phone}
              </p>
              {order.trackingNumber && (
                <p className="mt-3 text-sm text-text-muted">
                  Tracking: {order.trackingNumber}{" "}
                  {order.carrier ? `(${order.carrier})` : ""}
                </p>
              )}
            </div>
          )}

          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Payment
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Status: {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
