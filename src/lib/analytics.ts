"use client";

import { sendGAEvent } from "@next/third-parties/google";

interface GaItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

export function trackAddToCart(
  currency: string,
  value: number,
  items: GaItem[],
) {
  sendGAEvent("event", "add_to_cart", { currency, value, items });
}

export function trackBeginCheckout(
  currency: string,
  value: number,
  items: GaItem[],
) {
  sendGAEvent("event", "begin_checkout", { currency, value, items });
}

export function trackPurchase(params: {
  transactionId: string;
  currency: string;
  value: number;
  shipping: number;
  tax: number;
  items: GaItem[];
}) {
  sendGAEvent("event", "purchase", {
    transaction_id: params.transactionId,
    currency: params.currency,
    value: params.value,
    shipping: params.shipping,
    tax: params.tax,
    items: params.items,
  });
}
