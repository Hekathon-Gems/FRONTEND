"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Address } from "@/lib/types";
import type { AddressInput } from "@/lib/addresses-client";

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

export function AddressForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial?: Address;
  submitting: boolean;
  onSubmit: (values: AddressInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<AddressInput>({
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    addressLine1: initial?.addressLine1 ?? "",
    addressLine2: initial?.addressLine2 ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    postalCode: initial?.postalCode ?? "",
    country: initial?.country ?? "United States",
    isDefault: initial?.isDefault ?? false,
    label: initial?.label ?? "",
  });

  function set<K extends keyof AddressInput>(key: K, value: AddressInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-border bg-bg-cream p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASSES}>Full Name*</span>
          <input
            required
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_CLASSES}>Phone*</span>
          <input
            required
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
          <span className={LABEL_CLASSES}>State</span>
          <input
            value={values.state ?? ""}
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
          <input
            required
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>Label (optional)</span>
          <input
            placeholder="Home, Office, etc."
            value={values.label ?? ""}
            onChange={(e) => set("label", e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-text-primary-dark">
        <input
          type="checkbox"
          checked={values.isDefault ?? false}
          onChange={(e) => set("isDefault", e.target.checked)}
          className="h-4 w-4 rounded-sm border-border accent-accent-gold"
        />
        Set as default address
      </label>

      <div className="mt-5 flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          Save Address
        </Button>
      </div>
    </form>
  );
}
