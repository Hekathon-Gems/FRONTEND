"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import clsx from "clsx";
import { LinkButton } from "@/components/ui/Button";
import { StepIndicator } from "./StepIndicator";
import { ShippingForm, type ShippingFormValues } from "./ShippingForm";
import { PaymentPanel } from "./PaymentPanel";
import { ReviewPanel } from "./ReviewPanel";
import { StripeUnavailableNotice } from "./StripeUnavailableNotice";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import { getCart, removeCartItem, type CartResponse } from "@/lib/cart-client";
import {
  createCheckoutSession,
  updateCheckoutShipping,
} from "@/lib/checkout-client";
import { useCartStore } from "@/store/cart-store";
import { useIsLoggedIn } from "@/lib/use-is-logged-in";
import { trackBeginCheckout } from "@/lib/analytics";
import type { CheckoutSessionResponse, OrderResponse } from "@/lib/types";

const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

async function saveAddressForNextTime(
  values: ShippingFormValues,
): Promise<void> {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  await fetch(`${API_BASE_URL}/users/me/addresses`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName: values.fullName,
      phone: values.phone,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || undefined,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
    }),
  }).catch(() => {});
}

export function CheckoutFlow() {
  const isLoggedIn = useIsLoggedIn();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [session, setSession] = useState<CheckoutSessionResponse | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingSubmitting, setShippingSubmitting] = useState(false);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const router = useRouter();

  const stripePromise = useMemo<Promise<Stripe | null> | null>(
    () => (STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null),
    [],
  );

  useEffect(() => {
    getCart()
      .then((loaded) => {
        setCart(loaded);
        if (loaded.items.length > 0) {
          trackBeginCheckout(
            "USD",
            loaded.subtotal / 100,
            loaded.items.map((item) => ({
              item_id: item.product?.sku ?? item.productId,
              item_name: item.product?.name ?? "Unknown item",
              price: item.unitPrice / 100,
              quantity: item.quantity,
            })),
          );
        }
      })
      .catch(() =>
        setCartError(
          "We couldn't load your cart. Please refresh and try again.",
        ),
      );
  }, []);

  async function handleShippingSubmit(values: ShippingFormValues) {
    setShippingSubmitting(true);
    setShippingError(null);
    try {
      const created = await createCheckoutSession(
        isLoggedIn ? undefined : values.email,
      );
      const updatedOrder = await updateCheckoutShipping(created.id, {
        fullName: values.fullName,
        phone: values.phone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      });
      if (isLoggedIn && values.saveForNextTime) {
        void saveAddressForNextTime(values);
      }
      setSession({ ...created, order: updatedOrder });
      setStep(2);
    } catch (err) {
      setShippingError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setShippingSubmitting(false);
    }
  }

  async function handleOrderPlaced(finalizedOrder: OrderResponse) {
    if (cart) {
      await Promise.all(
        cart.items.map((item) => removeCartItem(item.id).catch(() => {})),
      );
    }
    setItemCount(0);
    router.push(
      `/order-confirmation/${encodeURIComponent(finalizedOrder.orderNumber)}`,
    );
  }

  if (cartError) {
    return (
      <p className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-danger">
        {cartError}
      </p>
    );
  }

  if (!cart) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-md bg-border" />
      </div>
    );
  }

  if (cart.items.length === 0 && !session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-heading text-xl text-text-primary-dark">
          Your cart is empty.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Looks like you haven&apos;t added any gemstones yet.
        </p>
        <LinkButton href="/gems" variant="primary" className="mt-6">
          Browse Gems
        </LinkButton>
      </div>
    );
  }

  const summaryItems = session
    ? session.order.items.map((item) => ({
        id: item.id,
        name: item.productName,
        image: item.productImageUrl,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      }))
    : cart.items.map((item) => ({
        id: item.id,
        name: item.product?.name ?? "Item",
        image: item.product?.image ?? null,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      }));

  const summaryTotals = session
    ? {
        subtotal: session.order.subtotal,
        discount: session.order.discount,
        shipping: session.order.shipping,
        tax: session.order.tax,
        total: session.order.total,
      }
    : {
        subtotal: cart.subtotal,
        discount: cart.discount,
        shipping: cart.shipping,
        tax: cart.tax,
        total: cart.total,
        couponCode: cart.coupon?.code,
      };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <p className="text-center text-xs text-text-muted">Home &gt; Checkout</p>
      <h1 className="mt-3 text-center font-heading text-3xl text-text-primary-dark">
        Secure Checkout
      </h1>
      <p className="mt-2 text-center text-sm text-text-muted">
        Complete your purchase in just a few steps.
      </p>

      <div className="mt-8">
        <StepIndicator currentStep={step} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className={clsx(step !== 1 && "hidden")}>
            <ShippingForm
              isLoggedIn={isLoggedIn}
              submitting={shippingSubmitting}
              errorMessage={shippingError}
              onSubmit={handleShippingSubmit}
            />
          </div>

          {session &&
            (stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: session.clientSecret }}
              >
                <div className={clsx(step !== 2 && "hidden")}>
                  <PaymentPanel
                    onContinue={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                </div>
                <div className={clsx(step !== 3 && "hidden")}>
                  <ReviewPanel
                    order={session.order}
                    onBack={() => setStep(2)}
                    onPlaced={handleOrderPlaced}
                  />
                </div>
              </Elements>
            ) : (
              (step === 2 || step === 3) && (
                <StripeUnavailableNotice onBack={() => setStep(1)} />
              )
            ))}
        </div>

        <aside>
          <OrderSummaryPanel items={summaryItems} totals={summaryTotals} />
        </aside>
      </div>
    </div>
  );
}
