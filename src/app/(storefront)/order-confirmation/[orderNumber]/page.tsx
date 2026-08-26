import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import { getOrderByNumber, NotFoundApiError } from "@/lib/api";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { LinkButton } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/format";

export default async function OrderConfirmationPage({
  params,
}: PageProps<"/order-confirmation/[orderNumber]">) {
  const { orderNumber } = await params;

  let order;
  try {
    order = await getOrderByNumber(decodeURIComponent(orderNumber));
  } catch (err) {
    if (err instanceof NotFoundApiError) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs text-text-muted">
        <Link href="/" className="hover:text-accent-gold">
          Home
        </Link>{" "}
        &gt; Order Confirmation
      </p>
      <h1 className="mt-3 font-heading text-3xl text-text-primary-dark">
        Order Confirmed
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Thank you for choosing Gemora Fine Gems.
      </p>

      <div className="mt-8 flex flex-col items-center rounded-md border border-border bg-bg-white px-6 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.25} />
        <h2 className="mt-4 font-heading text-2xl text-text-primary-dark">
          Your Order Has Been Placed!
        </h2>
        <p className="mt-2 max-w-sm text-sm text-text-muted">
          We&apos;ve received your order and are getting it ready for you.
        </p>

        <dl className="mt-8 grid w-full grid-cols-1 gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-text-muted">
              Order Number
            </dt>
            <dd className="mt-1 font-medium text-text-primary-dark">
              {order.orderNumber}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-text-muted">
              Order Date
            </dt>
            <dd className="mt-1 font-medium text-text-primary-dark">
              {formatDate(order.placedAt ?? order.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-text-muted">
              Email
            </dt>
            <dd className="mt-1 font-medium text-text-primary-dark">
              {order.email ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 rounded-md border border-border bg-bg-white p-6">
        <h2 className="text-center font-heading text-xl text-text-primary-dark">
          What Happens Next?
        </h2>
        <div className="mt-8">
          <OrderTimeline order={order} />
        </div>
      </div>

      <div className="mt-10 rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Order Summary
        </h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-text-primary-dark">
                {item.productName} × {item.quantity}
              </span>
              <span className="font-medium text-text-primary-dark">
                {formatPrice(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">Subtotal</dt>
            <dd className="text-text-primary-dark">
              {formatPrice(order.subtotal)}
            </dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-text-muted">Discount</dt>
              <dd className="text-success">-{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-text-muted">Shipping</dt>
            <dd className="text-text-primary-dark">
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Tax</dt>
            <dd className="text-text-primary-dark">{formatPrice(order.tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-text-primary-dark">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 rounded-md bg-bg-dark p-8 text-center">
        <h2 className="font-heading text-xl text-text-primary-light">
          Need Help?
        </h2>
        <p className="mt-2 text-sm text-text-muted-light">
          Our customer service team is here to assist you.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-text-muted-light">
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
            +1 (800) 123 4567
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
            hello@gemora.com
          </span>
        </div>
        <LinkButton href="/contact" variant="accent" className="mt-6">
          Contact Us
        </LinkButton>
      </div>
    </div>
  );
}
