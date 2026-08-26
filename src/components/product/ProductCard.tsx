"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { addToCart, cartItemCount } from "@/lib/cart-client";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const isSoldOut =
    product.stockStatus === "out_of_stock" || product.stockStatus === "sold";
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const setItemCount = useCartStore((state) => state.setItemCount);

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (status === "adding") return;
    setStatus("adding");
    try {
      const cart = await addToCart(product.id, 1);
      setItemCount(cartItemCount(cart));
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="group relative">
      <Link
        href={`/gems/${product.slug}`}
        className="block overflow-hidden rounded-md bg-bg-white shadow-card"
      >
        <div className="relative aspect-square overflow-hidden bg-bg-dark">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-muted-light">
              No Image
            </div>
          )}
          {isSoldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-bg-dark/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-text-primary-light">
              Sold Out
            </span>
          )}
          {!isSoldOut && (
            <button
              type="button"
              aria-label="Add to cart"
              title="Add to cart"
              onClick={handleQuickAdd}
              className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-white/90 text-text-primary-dark opacity-0 transition-opacity group-hover:opacity-100"
            >
              {status === "added" ? (
                <Check className="h-4 w-4 text-success" strokeWidth={1.5} />
              ) : (
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>

        <div className="p-4">
          <p className="font-heading text-[15px] text-text-primary-dark">
            {product.name}
          </p>
          {product.gemType?.name && (
            <p className="mt-1 text-xs text-text-muted">
              {product.gemType.name}
            </p>
          )}
          <p className="mt-2 text-[15px] font-semibold text-text-primary-dark">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
    </div>
  );
}
