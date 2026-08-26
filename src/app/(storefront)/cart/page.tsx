"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LinkButton, Button } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponForm } from "@/components/cart/CouponForm";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  cartItemCount,
  type CartResponse,
} from "@/lib/cart-client";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const router = useRouter();

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch(() =>
        setError("We couldn't load your cart. Please refresh and try again."),
      );
  }, []);

  function applyCartUpdate(updated: CartResponse) {
    setCart(updated);
    setItemCount(cartItemCount(updated));
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    const updated = await updateCartItemQuantity(itemId, quantity);
    applyCartUpdate(updated);
  }

  async function handleRemove(itemId: string) {
    const updated = await removeCartItem(itemId);
    applyCartUpdate(updated);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-border" />
          <div className="h-32 rounded bg-border" />
          <div className="h-32 rounded bg-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <p className="text-xs text-text-muted">
        <Link href="/" className="hover:text-accent-gold">
          Home
        </Link>{" "}
        &gt; Cart
      </p>
      <h1 className="mt-3 font-heading text-3xl text-text-primary-dark">
        Your Cart
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Review your selected gemstones before checkout.
      </p>

      {cart.items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-md border border-border bg-bg-white py-20 text-center">
          <p className="font-heading text-xl text-text-primary-dark">
            Your cart is empty.
          </p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Looks like you haven&apos;t added any gemstones yet.
          </p>
          <LinkButton href="/gems" variant="primary" className="mt-6">
            Browse Gems
          </LinkButton>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="hidden grid-cols-[1fr_auto] gap-4 border-b border-border pb-3 text-xs font-semibold uppercase tracking-[0.06em] text-text-muted sm:grid">
              <span>Product</span>
              <span>Total</span>
            </div>
            <div>
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <LinkButton href="/gems" variant="ghost">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Continue Shopping
              </LinkButton>
            </div>
          </div>

          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Order Summary
            </h2>
            <div className="mt-4">
              <CartSummary cart={cart} />
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <CouponForm onApplied={applyCartUpdate} />
            </div>

            <Button
              variant="primary"
              className="mt-6 w-full"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
