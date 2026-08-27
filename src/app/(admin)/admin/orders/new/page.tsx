"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AnimatedMessage } from "@/components/motion/AnimatedMessage";
import {
  OrderItemsPicker,
  type OrderLineItem,
} from "@/components/admin/OrderItemsPicker";
import {
  OrderCustomerPicker,
  type OrderCustomerSelection,
} from "@/components/admin/OrderCustomerPicker";
import { createManualOrder } from "@/lib/admin-client";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Singapore",
  "United Arab Emirates",
  "Japan",
];

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

export default function NewAdminOrderPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<OrderCustomerSelection>({
    mode: "existing",
    guestEmail: "",
  });
  const [items, setItems] = useState<OrderLineItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [note, setNote] = useState("");
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (customer.mode === "existing" && !customer.userId) {
      setError("Search for and select an existing customer.");
      return;
    }
    if (customer.mode === "guest" && !customer.guestEmail.trim()) {
      setError("Enter a guest email address.");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one product to the order.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createManualOrder({
        userId: customer.mode === "existing" ? customer.userId : undefined,
        guestEmail:
          customer.mode === "guest" ? customer.guestEmail.trim() : undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        fullName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state,
        postalCode,
        country,
        note: note || undefined,
        sendConfirmationEmail,
      });
      router.push(`/admin/orders/${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create this order.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        New Order
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Record a phone or in-person sale. Payment is assumed already collected —
        this marks the order paid and adjusts stock immediately.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <AnimatedMessage
          show={!!error}
          className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger"
        >
          {error}
        </AnimatedMessage>

        <div className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Customer
          </h2>
          <div className="mt-4">
            <OrderCustomerPicker value={customer} onChange={setCustomer} />
          </div>
        </div>

        <div className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">Items</h2>
          <div className="mt-4">
            <OrderItemsPicker items={items} onChange={setItems} />
          </div>
        </div>

        <div className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Shipping Address
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={LABEL_CLASSES}>Full Name*</span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={LABEL_CLASSES}>Phone Number*</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={LABEL_CLASSES}>Address*</span>
              <input
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={LABEL_CLASSES}>
                Apartment, suite, etc. (optional)
              </span>
              <input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>City*</span>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>State*</span>
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>ZIP Code*</span>
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Country*</span>
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={FIELD_CLASSES}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">Notes</h2>
          <label className="mt-4 flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Internal note (optional) — e.g. how payment was collected
            </span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Paid via in-store card terminal"
              className="w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm text-text-primary-dark">
            <input
              type="checkbox"
              checked={sendConfirmationEmail}
              onChange={(e) => setSendConfirmationEmail(e.target.checked)}
              className="h-4 w-4 accent-accent-gold"
            />
            Send an order confirmation email to the customer
          </label>
        </div>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Creating…" : "Create Order"}
        </Button>
      </form>
    </div>
  );
}
