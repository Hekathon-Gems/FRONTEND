"use client";

import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { getCart, cartItemCount } from "@/lib/cart-client";

export function CartIndicator() {
  const itemCount = useCartStore((state) => state.itemCount);
  const setItemCount = useCartStore((state) => state.setItemCount);

  useEffect(() => {
    getCart()
      .then((cart) => setItemCount(cartItemCount(cart)))
      .catch(() => {});
  }, [setItemCount]);

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      title="Cart"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-text-primary-light transition-colors hover:text-accent-gold"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-gold px-1 text-[10px] font-semibold text-bg-dark">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
