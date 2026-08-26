"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { applyCoupon, type CartResponse } from "@/lib/cart-client";
import { formatPrice } from "@/lib/format";

export function CouponForm({
  onApplied,
}: {
  onApplied: (cart: CartResponse) => void;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus("submitting");
    try {
      const cart = await applyCoupon(code.trim());
      onApplied(cart);
      setStatus("success");
      setMessage(`Coupon applied — you saved ${formatPrice(cart.discount)}.`);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "This code is invalid or has expired.",
      );
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-text-primary-dark">
        Have a coupon?
      </p>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code"
          className="h-11 flex-1 rounded-sm border border-border px-3 text-sm focus:border-accent-gold focus:outline-none"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={status === "submitting"}
        >
          Apply
        </Button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-sm text-success">{message}</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-danger">{message}</p>
      )}
    </div>
  );
}
