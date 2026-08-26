"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { ShippingAddress } from "@/lib/types";

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

export interface ShippingFormValues extends ShippingAddress {
  email: string;
  saveForNextTime: boolean;
}

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark placeholder:text-text-muted focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

export function ShippingForm({
  isLoggedIn,
  submitting,
  errorMessage,
  onSubmit,
}: {
  isLoggedIn: boolean;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: ShippingFormValues) => void;
}) {
  const [values, setValues] = useState<ShippingFormValues>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    saveForNextTime: false,
  });

  function set<K extends keyof ShippingFormValues>(
    key: K,
    value: ShippingFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-border bg-bg-white p-6"
    >
      <h2 className="font-heading text-lg text-text-primary-dark">
        Shipping Information
      </h2>

      {errorMessage && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASSES}>Full Name*</span>
          <input
            required
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        {!isLoggedIn && (
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={LABEL_CLASSES}>Email Address*</span>
            <input
              required
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASSES}>Phone Number*</span>
          <input
            required
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASSES}>Address*</span>
          <input
            required
            value={values.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASSES}>
            Apartment, suite, etc. (optional)
          </span>
          <input
            value={values.addressLine2 ?? ""}
            onChange={(e) => set("addressLine2", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>City*</span>
          <input
            required
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>State*</span>
          <input
            required
            value={values.state}
            onChange={(e) => set("state", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>ZIP Code*</span>
          <input
            required
            value={values.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>Country*</span>
          <select
            required
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            className={FIELD_CLASSES}
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoggedIn && (
        <label className="mt-4 flex items-center gap-2 text-sm text-text-primary-dark">
          <input
            type="checkbox"
            checked={values.saveForNextTime}
            onChange={(e) => set("saveForNextTime", e.target.checked)}
            className="h-4 w-4 rounded-sm border-border accent-accent-gold"
          />
          Save this information for next time
        </label>
      )}

      <Button
        type="submit"
        variant="primary"
        className="mt-6 w-full"
        disabled={submitting}
      >
        Continue to Payment →
      </Button>
    </form>
  );
}
