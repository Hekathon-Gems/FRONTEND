"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Gem, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { CartItemResponse } from "@/lib/cart-client";

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItemResponse;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  async function changeQuantity(next: number) {
    if (next < 1 || busy) return;
    setBusy(true);
    try {
      await onUpdateQuantity(item.id, next);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    if (busy) return;
    setBusy(true);
    try {
      await onRemove(item.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-4 border-b border-border py-6 first:pt-0 last:border-b-0">
      <Link
        href={item.product ? `/gems/${item.product.slug}` : "#"}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-bg-dark"
      >
        {item.product?.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted-light">
            <Gem className="h-8 w-8" strokeWidth={1} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={item.product ? `/gems/${item.product.slug}` : "#"}
              className="font-heading text-base text-text-primary-dark hover:text-accent-gold"
            >
              {item.product?.name ?? "Item no longer available"}
            </Link>
            {item.product?.sku && (
              <p className="mt-1 text-xs text-text-muted">
                SKU: {item.product.sku}
              </p>
            )}
          </div>
          <p className="whitespace-nowrap text-sm font-semibold text-text-primary-dark">
            {formatPrice(item.unitPrice)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-md border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={busy}
              onClick={() => changeQuantity(item.quantity - 1)}
              className="flex h-9 w-9 items-center justify-center text-text-primary-dark hover:text-accent-gold disabled:opacity-50"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={busy}
              onClick={() => changeQuantity(item.quantity + 1)}
              className="flex h-9 w-9 items-center justify-center text-text-primary-dark hover:text-accent-gold disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-text-primary-dark">
              {formatPrice(item.lineTotal)}
            </p>
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-xs text-danger hover:underline disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
