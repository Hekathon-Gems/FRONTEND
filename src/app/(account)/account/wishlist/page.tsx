"use client";

import { useEffect, useState } from "react";
import { LinkButton, Button } from "@/components/ui/Button";
import { WishlistCard } from "@/components/account/WishlistCard";
import {
  getWishlist,
  removeFromWishlist,
  moveWishlistToCart,
} from "@/lib/wishlist-client";
import { cartItemCount, getCart } from "@/lib/cart-client";
import { useCartStore } from "@/store/cart-store";
import type { WishlistItemResponse } from "@/lib/types";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItemResponse[] | null>(null);
  const [moving, setMoving] = useState(false);
  const [moveMessage, setMoveMessage] = useState<string | null>(null);
  const setItemCount = useCartStore((state) => state.setItemCount);

  useEffect(() => {
    getWishlist().then(setItems);
  }, []);

  async function handleRemove(productId: string) {
    setItems(
      (prev) => prev?.filter((item) => item.productId !== productId) ?? prev,
    );
    await removeFromWishlist(productId).catch(() => {});
  }

  async function handleMoveAll() {
    setMoving(true);
    setMoveMessage(null);
    try {
      const result = await moveWishlistToCart();
      setItems([]);
      const cart = await getCart();
      setItemCount(cartItemCount(cart));
      setMoveMessage(
        result.skippedCount > 0
          ? `Moved ${result.movedCount} item(s) to your bag. ${result.skippedCount} item(s) were no longer available.`
          : `Moved ${result.movedCount} item(s) to your bag.`,
      );
    } finally {
      setMoving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Your favorite gemstones and jewelry.
          </p>
        </div>
        {items && items.length > 0 && (
          <Button variant="primary" onClick={handleMoveAll} disabled={moving}>
            Move All to Bag
          </Button>
        )}
      </div>

      {moveMessage && (
        <p className="mt-4 rounded-md bg-success-bg px-3 py-2 text-sm text-success">
          {moveMessage}
        </p>
      )}

      {items === null ? (
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-md bg-border"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-md border border-border bg-bg-white py-16 text-center">
          <p className="font-heading text-lg text-text-primary-dark">
            Your wishlist is empty.
          </p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Save gemstones you love and find them here anytime.
          </p>
          <LinkButton href="/gems" variant="primary" className="mt-6">
            Browse Gems
          </LinkButton>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-text-muted">
            You&apos;ve reached the end of your wishlist.
          </p>
        </>
      )}
    </div>
  );
}
