"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";
import type { OrderResponse } from "@/lib/types";

export function PurchaseTracker({ order }: { order: OrderResponse }) {
  useEffect(() => {
    trackPurchase({
      transactionId: order.orderNumber,
      currency: order.currency,
      value: order.total / 100,
      shipping: order.shipping / 100,
      tax: order.tax / 100,
      items: order.items.map((item) => ({
        item_id: item.sku ?? item.productId ?? item.productName,
        item_name: item.productName,
        price: item.unitPrice / 100,
        quantity: item.quantity,
      })),
    });
    // Fire once per confirmation view; transaction_id lets GA4 dedupe reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.orderNumber]);

  return null;
}
