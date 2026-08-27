"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-client";
import { formatPrice } from "@/lib/format";
import type { AdminProduct } from "@/lib/admin-types";

export interface OrderLineItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  currency: string;
  maxQuantity: number;
  quantity: number;
}

export function OrderItemsPicker({
  items,
  onChange,
}: {
  items: OrderLineItem[];
  onChange: (next: OrderLineItem[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminProduct[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const res = await getAdminProducts({ q: value, active: "true" });
    setResults(
      res.data.filter((p) => !items.some((i) => i.productId === p.id)),
    );
  }

  function add(product: AdminProduct) {
    onChange([
      ...items,
      {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        currency: product.currency,
        maxQuantity: product.isUnique ? 1 : Math.max(product.stockQuantity, 1),
        quantity: 1,
      },
    ]);
    setQuery("");
    setResults([]);
  }

  function remove(productId: string) {
    onChange(items.filter((i) => i.productId !== productId));
  }

  function setQuantity(productId: string, quantity: number) {
    onChange(
      items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxQuantity) }
          : i,
      ),
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products by name or SKU to add..."
          className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-bg-white shadow-elevated">
            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => add(product)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bg-cream"
              >
                <span>
                  {product.name}{" "}
                  <span className="text-text-muted">({product.sku})</span>
                </span>
                <span className="text-text-muted">
                  {formatPrice(product.price, product.currency)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-cream text-xs uppercase tracking-[0.05em] text-text-muted">
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium">Line Total</th>
                <th className="w-10 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.productId}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-3 py-2">
                    {item.name}{" "}
                    <span className="text-text-muted">({item.sku})</span>
                  </td>
                  <td className="px-3 py-2 text-text-muted">
                    {formatPrice(item.price, item.currency)}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(e) =>
                        setQuantity(item.productId, Number(e.target.value))
                      }
                      className="h-9 w-16 rounded-sm border border-border bg-bg-white px-2 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 text-text-primary-dark">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.productId)}
                      className="text-text-muted hover:text-danger"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end border-t border-border bg-bg-cream px-3 py-2 text-sm">
            <span className="text-text-muted">Subtotal:&nbsp;</span>
            <span className="font-medium text-text-primary-dark">
              {formatPrice(subtotal, items[0]?.currency ?? "USD")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
