import { formatPrice } from "@/lib/format";
import type { CartResponse } from "@/lib/cart-client";

export function CartSummary({
  cart,
}: {
  cart: Pick<
    CartResponse,
    "subtotal" | "discount" | "shipping" | "tax" | "total" | "coupon"
  >;
}) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-text-muted">Subtotal</dt>
        <dd className="font-medium text-text-primary-dark">
          {formatPrice(cart.subtotal)}
        </dd>
      </div>
      {cart.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-text-muted">
            Discount {cart.coupon?.code ? `(${cart.coupon.code})` : ""}
          </dt>
          <dd className="font-medium text-success">
            -{formatPrice(cart.discount)}
          </dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-text-muted">Shipping</dt>
        <dd className="font-medium text-text-primary-dark">
          {cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-text-muted">Tax</dt>
        <dd className="font-medium text-text-primary-dark">
          {formatPrice(cart.tax)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-border pt-3 text-base">
        <dt className="font-semibold text-text-primary-dark">Total</dt>
        <dd className="font-semibold text-text-primary-dark">
          {formatPrice(cart.total)}
        </dd>
      </div>
    </dl>
  );
}
