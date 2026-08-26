"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminCustomers } from "@/lib/admin-client";
import { formatDate, formatPrice } from "@/lib/format";
import type { AdminCustomerListResponse } from "@/lib/admin-types";

export default function AdminCustomersPage() {
  const [result, setResult] = useState<AdminCustomerListResponse | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  function load() {
    getAdminCustomers({ q: q || undefined, page: String(page) }).then(
      setResult,
    );
  }

  useEffect(load, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Customers
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Read-only customer directory.
      </p>

      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              load();
            }
          }}
          placeholder="Search name or email..."
          className="h-10 w-full max-w-sm rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Lifetime Spend</th>
              <th className="px-4 py-3 font-medium">Marketing</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(result?.data ?? []).map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="font-medium text-accent-gold hover:underline"
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted">{customer.email}</td>
                <td className="px-4 py-3 text-text-muted">
                  {formatDate(customer.joinedAt)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {customer.totalOrders}
                </td>
                <td className="px-4 py-3 text-text-primary-dark">
                  {formatPrice(customer.lifetimeSpendCents)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {customer.marketingEmails ? "Opted In" : "Opted Out"}
                </td>
                <td className="px-4 py-3">
                  {customer.disabledAt ? (
                    <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs text-danger">
                      Disabled
                    </span>
                  ) : (
                    <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs text-success">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {result && result.data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result && result.meta.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-1.5 text-sm text-text-muted">
            Page {result.meta.page} of {result.meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
