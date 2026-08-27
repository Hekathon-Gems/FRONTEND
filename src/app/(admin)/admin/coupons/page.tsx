"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/admin-client";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import type { AdminCoupon } from "@/lib/admin-types";

const FIELD_CLASSES =
  "h-10 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none";

export default function AdminCouponsPage() {
  const role = useAuthStore((state) => state.user?.role);
  const isAdmin = role === "admin";
  const [rows, setRows] = useState<AdminCoupon[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [discountValue, setDiscountValue] = useState(10);
  const [minSpend, setMinSpend] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    getAdminCoupons().then(setRows);
  }

  useEffect(load, []);

  function startEdit(row?: AdminCoupon) {
    setError(null);
    setEditingId(row?.id ?? "new");
    setCode(row?.code ?? "");
    setDiscountType(row?.discountType ?? "percentage");
    setDiscountValue(row ? Number(row.discountValue) : 10);
    setMinSpend(
      row?.minSpendCents ? String(Number(row.minSpendCents) / 100) : "",
    );
    setUsageLimit(row?.usageLimit ? String(row.usageLimit) : "");
    setExpiresAt(row?.expiresAt ? row.expiresAt.slice(0, 10) : "");
    setIsActive(row?.isActive ?? true);
  }

  async function save() {
    const input = {
      code,
      discountType,
      discountValue,
      minSpend: minSpend ? Math.round(Number(minSpend) * 100) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiresAt: expiresAt || undefined,
      isActive,
    };
    try {
      if (editingId === "new") await createCoupon(input);
      else if (editingId) await updateCoupon(editingId, input);
      setEditingId(null);
      load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save this coupon.",
      );
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this coupon?")) return;
    await deleteCoupon(id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            Coupons
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Discount codes for checkout.
          </p>
        </div>
        {isAdmin && (
          <Button variant="outline" onClick={() => startEdit()}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Coupon
          </Button>
        )}
      </div>

      {editingId && (
        <div className="mt-4 rounded-md border border-border bg-bg-cream p-4">
          {error && (
            <p className="mb-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CODE"
              className={FIELD_CLASSES}
            />
            <select
              aria-label="Discount type"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as "percentage" | "fixed")
              }
              className={FIELD_CLASSES}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              placeholder="Discount Value"
              className={FIELD_CLASSES}
            />
            <input
              type="number"
              value={minSpend}
              onChange={(e) => setMinSpend(e.target.value)}
              placeholder="Minimum Spend ($)"
              className={FIELD_CLASSES}
            />
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Usage Limit"
              className={FIELD_CLASSES}
            />
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={FIELD_CLASSES}
            />
            <label className="flex items-center gap-2 text-sm text-text-primary-dark">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-accent-gold"
              />
              Active
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              variant="primary"
              onClick={save}
              disabled={!code || !discountValue}
            >
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Min Spend</th>
              <th className="px-4 py-3 font-medium">Usage</th>
              <th className="px-4 py-3 font-medium">Active</th>
              {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-text-primary-dark">
                  {row.code}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {row.discountType === "percentage"
                    ? `${row.discountValue}%`
                    : formatPrice(Number(row.discountValue) * 100)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {formatPrice(Number(row.minSpendCents))}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {row.timesUsed}
                  {row.usageLimit ? ` / ${row.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {row.isActive ? "Yes" : "No"}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="mr-3 text-accent-gold-text underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {rows && rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
