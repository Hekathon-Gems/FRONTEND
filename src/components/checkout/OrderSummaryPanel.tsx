import Image from "next/image";
import Link from "next/link";
import { Gem } from "lucide-react";
import { formatPrice } from "@/lib/format";

export interface SummaryItem {
  id: string;
  name: string;
  image: string | null;
  quantity: number;
  lineTotal: number;
}

export interface SummaryTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string | null;
}

export function OrderSummaryPanel({
  items,
  totals,
}: {
  items: SummaryItem[];
  totals: SummaryTotals;
}) {
  return (
    <div className="rounded-md border border-border bg-bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Order Summary
        </h2>
        <Link href="/cart" className="text-xs text-accent-gold-text underline">
          Edit Cart
        </Link>
      </div>

      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-dark">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted-light">
                  <Gem className="h-4 w-4" strokeWidth={1} />
                </div>
              )}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-bg-dark text-[10px] text-text-primary-light">
                {item.quantity}
              </span>
            </div>
            <p className="flex-1 truncate text-sm text-text-primary-dark">
              {item.name}
            </p>
            <p className="text-sm font-medium text-text-primary-dark">
              {formatPrice(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>

      <dl className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-muted">Subtotal</dt>
          <dd className="font-medium text-text-primary-dark">
            {formatPrice(totals.subtotal)}
          </dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-text-muted">
              Discount {totals.couponCode ? `(${totals.couponCode})` : ""}
            </dt>
            <dd className="font-medium text-success">
              -{formatPrice(totals.discount)}
            </dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-text-muted">Shipping</dt>
          <dd className="font-medium text-text-primary-dark">
            {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-muted">Tax</dt>
          <dd className="font-medium text-text-primary-dark">
            {formatPrice(totals.tax)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base">
          <dt className="font-semibold text-text-primary-dark">Total</dt>
          <dd className="font-semibold text-text-primary-dark">
            {formatPrice(totals.total)}
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs text-text-muted">
        <p>Certified Authenticity — All gemstones come with certificates</p>
        <p>Secure Payment — 100% protected transactions</p>
        <p>Free Shipping — On orders over $1,000</p>
        <p>Easy Returns — 7 days return policy</p>
      </div>
    </div>
  );
}
