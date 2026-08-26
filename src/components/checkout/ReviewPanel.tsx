"use client";

import { useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { placeCheckoutOrder } from "@/lib/checkout-client";
import { formatPrice } from "@/lib/format";
import type { OrderResponse } from "@/lib/types";

const PAYMENT_ERROR_MESSAGE =
  "We couldn't process your payment. Please check your card details and try again.";

export function ReviewPanel({
  order,
  onBack,
  onPlaced,
}: {
  order: OrderResponse;
  onBack: () => void;
  onPlaced: (order: OrderResponse) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setSubmitting(false);
      setError(confirmError.message ?? PAYMENT_ERROR_MESSAGE);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      setSubmitting(false);
      setError(PAYMENT_ERROR_MESSAGE);
      return;
    }

    try {
      const finalizedOrder = await placeCheckoutOrder(order.id);
      onPlaced(finalizedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : PAYMENT_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-bg-white p-6">
      <h2 className="font-heading text-lg text-text-primary-dark">
        Review Your Order
      </h2>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {order.shippingAddress && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-text-muted">
            Shipping To
          </p>
          <p className="mt-2 text-sm text-text-primary-dark">
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
        </div>
      )}

      <div className="mt-6 divide-y divide-border border-y border-border">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-3 text-sm">
            <span className="text-text-primary-dark">
              {item.productName} × {item.quantity}
            </span>
            <span className="font-medium text-text-primary-dark">
              {formatPrice(item.lineTotal)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={handlePlaceOrder}
          disabled={submitting}
        >
          {submitting ? "Placing Order…" : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
