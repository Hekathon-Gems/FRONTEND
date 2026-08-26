"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusPill } from "@/components/account/StatusPill";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { getOrderByNumber } from "@/lib/orders-client";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderResponse } from "@/lib/types";

export default function AccountOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = decodeURIComponent(params.orderNumber);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setError("We couldn't find this order."));
  }, [orderNumber]);

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-accent-gold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Order History
      </Link>

      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {!order && !error && (
        <div className="mt-6 h-64 animate-pulse rounded-md bg-border" />
      )}

      {order && (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
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

          <div className="mt-8 rounded-md border border-border bg-bg-white p-6">
            <OrderTimeline order={order} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-md border border-border bg-bg-white p-6 lg:col-span-2">
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

            {order.shippingAddress && (
              <div className="rounded-md border border-border bg-bg-white p-6">
                <h2 className="font-heading text-lg text-text-primary-dark">
                  Shipping To
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
                {order.trackingNumber && (
                  <p className="mt-3 text-sm text-text-muted">
                    Tracking: {order.trackingNumber}{" "}
                    {order.carrier ? `(${order.carrier})` : ""}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
