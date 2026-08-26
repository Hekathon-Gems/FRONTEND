"use client";

import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AddressForm } from "@/components/account/AddressForm";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressInput,
} from "@/lib/addresses-client";
import type { Address } from "@/lib/types";

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [formMode, setFormMode] = useState<"none" | "add" | string>("none");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getAddresses().then(setAddresses);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(values: AddressInput) {
    setSubmitting(true);
    try {
      await createAddress(values);
      setFormMode("none");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id: string, values: AddressInput) {
    setSubmitting(true);
    try {
      await updateAddress(id, values);
      setFormMode("none");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this address? This can't be undone.")) return;
    await deleteAddress(id);
    load();
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            Saved Addresses
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Manage your shipping addresses.
          </p>
        </div>
        {formMode === "none" && (
          <Button variant="primary" onClick={() => setFormMode("add")}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add New Address
          </Button>
        )}
      </div>

      {formMode === "add" && (
        <div className="mt-6">
          <AddressForm
            submitting={submitting}
            onSubmit={handleCreate}
            onCancel={() => setFormMode("none")}
          />
        </div>
      )}

      {addresses === null ? (
        <div className="mt-6 h-48 animate-pulse rounded-md bg-border" />
      ) : addresses.length === 0 && formMode === "none" ? (
        <div className="mt-10 flex flex-col items-center rounded-md border border-border bg-bg-white py-16 text-center">
          <p className="font-heading text-lg text-text-primary-dark">
            You don&apos;t have any saved addresses yet.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => setFormMode("add")}
          >
            Add New Address
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {addresses.map((address) =>
            formMode === address.id ? (
              <div key={address.id} className="sm:col-span-2">
                <AddressForm
                  initial={address}
                  submitting={submitting}
                  onSubmit={(values) => handleUpdate(address.id, values)}
                  onCancel={() => setFormMode("none")}
                />
              </div>
            ) : (
              <div
                key={address.id}
                className="rounded-md border border-border bg-bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {address.label && (
                      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                        {address.label}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-medium text-text-primary-dark">
                      {address.fullName}
                    </p>
                  </div>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold/10 px-3 py-1 text-xs font-medium text-accent-gold-dark">
                      <Star className="h-3 w-3" strokeWidth={2} />
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-text-muted">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                </p>
                <p className="text-sm text-text-muted">
                  {address.city}
                  {address.state ? `, ${address.state}` : ""}{" "}
                  {address.postalCode}
                </p>
                <p className="text-sm text-text-muted">{address.country}</p>
                <p className="mt-1 text-sm text-text-muted">{address.phone}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-accent-gold hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFormMode(address.id)}
                    className="text-text-primary-dark hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    className="text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
