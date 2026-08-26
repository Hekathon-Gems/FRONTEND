"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { addToCart, cartItemCount } from "@/lib/cart-client";
import { useCartStore } from "@/store/cart-store";
import type { WishlistItemResponse } from "@/lib/types";

export function WishlistCard({
  item,
  onRemove,
}: {
  item: WishlistItemResponse;
  onRemove: (productId: string) => void;
}) {
  const { product } = item;
  const image = product.images[0];
  const isSoldOut =
    product.stockStatus === "out_of_stock" || product.stockStatus === "sold";
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const setItemCount = useCartStore((state) => state.setItemCount);

  async function handleAddToCart() {
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
    <div className="rounded-md bg-bg-white shadow-card">
      <div className="relative aspect-square overflow-hidden rounded-t-md bg-bg-dark">
        <Link href={`/gems/${product.slug}`}>
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
              fill
              sizes="25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-muted-light">
              No Image
            </div>
          )}
        </Link>
        {isSoldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-bg-dark/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-text-primary-light">
            Sold Out
          </span>
        )}
        <button
          type="button"
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
          onClick={() => onRemove(product.id)}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-white/90 text-danger"
        >
          <Heart className="h-4 w-4 fill-current" strokeWidth={1.5} />
        </button>
        {!isSoldOut && (
          <button
            type="button"
            aria-label="Add to cart"
            title="Add to cart"
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-white/90 text-text-primary-dark"
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
        <Link
          href={`/gems/${product.slug}`}
          className="font-heading text-[15px] text-text-primary-dark"
        >
          {product.name}
        </Link>
        {product.gemType?.name && (
          <p className="mt-1 text-xs text-text-muted">{product.gemType.name}</p>
        )}
        <p className="mt-2 text-[15px] font-semibold text-text-primary-dark">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </div>
  );
}
