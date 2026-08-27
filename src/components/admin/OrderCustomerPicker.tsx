"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getAdminCustomers } from "@/lib/admin-client";
import type { AdminCustomerSummary } from "@/lib/admin-types";

export interface OrderCustomerSelection {
  mode: "existing" | "guest";
  userId?: string;
  userLabel?: string;
  guestEmail: string;
}

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";

export function OrderCustomerPicker({
  value,
  onChange,
}: {
  value: OrderCustomerSelection;
  onChange: (next: OrderCustomerSelection) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminCustomerSummary[]>([]);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const res = await getAdminCustomers({ q });
    setResults(res.data);
  }

  function selectCustomer(customer: AdminCustomerSummary) {
    onChange({
      mode: "existing",
      userId: customer.id,
      userLabel: `${customer.firstName} ${customer.lastName} (${customer.email})`,
      guestEmail: "",
    });
    setQuery("");
    setResults([]);
  }

  function clearCustomer() {
    onChange({
      mode: "existing",
      userId: undefined,
      userLabel: undefined,
      guestEmail: "",
    });
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({ ...value, mode: "existing", guestEmail: "" })
          }
          className={`rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.05em] ${
            value.mode === "existing"
              ? "border-accent-gold bg-accent-gold/10 text-accent-gold-text"
              : "border-border text-text-muted"
          }`}
        >
          Existing Customer
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
              mode: "guest",
              userId: undefined,
              userLabel: undefined,
              guestEmail: value.guestEmail,
            })
          }
          className={`rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.05em] ${
            value.mode === "guest"
              ? "border-accent-gold bg-accent-gold/10 text-accent-gold-text"
              : "border-border text-text-muted"
          }`}
        >
          Guest
        </button>
      </div>

      {value.mode === "existing" ? (
        value.userId && value.userLabel ? (
          <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-bg-cream px-3 py-2 text-sm">
            <span>{value.userLabel}</span>
            <button
              type="button"
              onClick={clearCustomer}
              aria-label="Clear customer"
            >
              <X className="h-4 w-4 text-text-muted" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="relative mt-3">
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search customers by name or email..."
              className={FIELD_CLASSES}
            />
            {results.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-bg-white shadow-elevated">
                {results.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCustomer(c)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-bg-cream"
                  >
                    {c.firstName} {c.lastName}{" "}
                    <span className="text-text-muted">({c.email})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        <label className="mt-3 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            Guest Email*
          </span>
          <input
            type="email"
            value={value.guestEmail}
            onChange={(e) => onChange({ ...value, guestEmail: e.target.value })}
            placeholder="customer@example.com"
            className={FIELD_CLASSES}
          />
        </label>
      )}
    </div>
  );
}
