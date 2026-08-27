"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAdminCustomer, setCustomerDisabled } from "@/lib/admin-client";
import { useAuthStore } from "@/store/auth-store";
import { formatDate, formatPrice } from "@/lib/format";
import type { AdminCustomerDetail } from "@/lib/admin-types";

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);

  function load() {
    getAdminCustomer(params.id).then(setCustomer);
  }

  useEffect(load, [params.id]);

  async function toggleDisabled() {
    if (!customer) return;
    const disable = !customer.disabledAt;
    if (
      disable &&
      !window.confirm(
        "Disable this account? This blocks login without deleting data.",
      )
    )
      return;
    await setCustomerDisabled(params.id, disable);
    load();
  }

  if (!customer)
    return <div className="h-64 animate-pulse rounded-md bg-border" />;

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/admin/customers")}
        className="inline-flex items-center gap-1.5 text-sm text-accent-gold-text underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Customers
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {customer.email} · Joined {formatDate(customer.joinedAt)}
          </p>
        </div>
        {role === "admin" && (
          <Button
            variant="outline"
            className={customer.disabledAt ? "" : "border-danger text-danger"}
            onClick={toggleDisabled}
          >
            {customer.disabledAt ? "Re-enable Account" : "Disable Account"}
          </Button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Order History
            </h2>
            <div className="mt-4 divide-y divide-border">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between py-3 text-sm"
                >
                  <span className="text-text-primary-dark">
                    {order.orderNumber}
                  </span>
                  <span className="text-text-muted capitalize">
                    {order.status}
                  </span>
                  <span className="font-medium text-text-primary-dark">
                    {formatPrice(order.total)}
                  </span>
                </div>
              ))}
              {customer.orders.length === 0 && (
                <p className="py-3 text-sm text-text-muted">No orders yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Wishlist
            </h2>
            <div className="mt-4 divide-y divide-border">
              {customer.wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-3 text-sm"
                >
                  <span className="text-text-primary-dark">
                    {item.product.name}
                  </span>
                  <span className="font-medium text-text-primary-dark">
                    {formatPrice(item.product.price)}
                  </span>
                </div>
              ))}
              {customer.wishlist.length === 0 && (
                <p className="py-3 text-sm text-text-muted">
                  Wishlist is empty.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-md border border-border bg-bg-white p-6">
            <h2 className="font-heading text-lg text-text-primary-dark">
              Saved Addresses
            </h2>
            <div className="mt-4 space-y-4">
              {customer.addresses.map((address) => (
                <div key={address.id} className="text-sm">
                  <p className="font-medium text-text-primary-dark">
                    {address.fullName}{" "}
                    {address.isDefault && (
                      <span className="text-accent-gold-text">(Default)</span>
                    )}
                  </p>
                  <p className="text-text-muted">{address.addressLine1}</p>
                  <p className="text-text-muted">
                    {address.city}, {address.country}
                  </p>
                </div>
              ))}
              {customer.addresses.length === 0 && (
                <p className="text-sm text-text-muted">No saved addresses.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
