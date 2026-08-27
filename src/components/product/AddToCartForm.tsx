"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AnimatedMessage } from "@/components/motion/AnimatedMessage";
import { addToCart, cartItemCount } from "@/lib/cart-client";
import { useCartStore } from "@/store/cart-store";
import { trackAddToCart } from "@/lib/analytics";
import type { Product } from "@/lib/types";

type Status = "idle" | "submitting" | "success" | "error";

export function AddToCartForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const router = useRouter();

  const isSoldOut =
    product.stockStatus === "out_of_stock" || product.stockStatus === "sold";
  const maxQuantity = product.isUnique ? 1 : Math.max(product.stockQuantity, 1);

  async function submit(redirectToCheckout: boolean) {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const cart = await addToCart(product.id, quantity);
      setItemCount(cartItemCount(cart));
      setStatus("success");
      trackAddToCart(product.currency, (product.price * quantity) / 100, [
        {
          item_id: product.sku,
          item_name: product.name,
          price: product.price / 100,
          quantity,
        },
      ]);
      if (redirectToCheckout) router.push("/cart");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not add this item to your bag.",
      );
    }
  }

  if (isSoldOut) {
    return (
      <div className="rounded-md bg-danger-bg p-4 text-sm text-danger">
        This one-of-a-kind gem has just been sold. Explore similar pieces below.
      </div>
    );
  }

  return (
    <div>
      {!product.isUnique && (
        <div className="mb-4 inline-flex items-center rounded-md border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-text-primary-dark hover:text-accent-gold"
          >
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <span className="w-10 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="flex h-11 w-11 items-center justify-center text-text-primary-dark hover:text-accent-gold"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          className="flex-1"
          disabled={status === "submitting"}
          onClick={() => submit(false)}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={status === "submitting"}
          onClick={() => submit(true)}
        >
          Buy Now
        </Button>
      </div>

      <AnimatedMessage
        show={status === "success"}
        className="mt-3 text-sm text-success"
      >
        Added to your bag.{" "}
        <Link href="/cart" className="font-medium underline">
          View Cart →
        </Link>
      </AnimatedMessage>
      <AnimatedMessage
        show={status === "error" && !!errorMessage}
        className="mt-3 text-sm text-danger"
      >
        {errorMessage}
      </AnimatedMessage>
    </div>
  );
}
