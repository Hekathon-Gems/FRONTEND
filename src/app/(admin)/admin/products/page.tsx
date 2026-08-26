"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Gem } from "lucide-react";
import {
  getAdminProducts,
  bulkActivateProducts,
  bulkDeactivateProducts,
  getAdminCategories,
  getAdminGemTypes,
} from "@/lib/admin-client";
import { formatPrice } from "@/lib/format";
import type {
  AdminProductListResponse,
  AdminCategory,
  AdminGemType,
} from "@/lib/admin-types";

const STOCK_STATUSES = ["in_stock", "low_stock", "out_of_stock", "sold"];

export default function AdminProductsPage() {
  const [result, setResult] = useState<AdminProductListResponse | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [gemTypes, setGemTypes] = useState<AdminGemType[]>([]);
  const [category, setCategory] = useState("");
  const [gemType, setGemType] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [active, setActive] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAdminCategories().then(setCategories);
    getAdminGemTypes().then(setGemTypes);
  }, []);

  function load() {
    getAdminProducts({
      category: category || undefined,
      gemType: gemType || undefined,
      stockStatus: stockStatus || undefined,
      active: active || undefined,
      q: q || undefined,
      page: String(page),
    }).then(setResult);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, gemType, stockStatus, active, page]);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulk(activate: boolean) {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (activate) await bulkActivateProducts(ids);
    else await bulkDeactivateProducts(ids);
    setSelected(new Set());
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            Products
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage the storefront catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-bg-dark px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-primary-light hover:bg-black"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search name or SKU..."
          className="h-10 flex-1 min-w-[180px] rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={gemType}
          onChange={(e) => setGemType(e.target.value)}
          className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm"
        >
          <option value="">All Gem Types</option>
          {gemTypes.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm"
        >
          <option value="">All Stock</option>
          {STOCK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm"
        >
          <option value="">Active + Inactive</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-md bg-bg-dark px-4 py-2.5 text-sm text-text-primary-light">
          <span>{selected.size} selected</span>
          <button
            type="button"
            onClick={() => handleBulk(true)}
            className="text-accent-gold hover:underline"
          >
            Activate
          </button>
          <button
            type="button"
            onClick={() => handleBulk(false)}
            className="text-accent-gold hover:underline"
          >
            Deactivate
          </button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Gem Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(result?.data ?? []).map((product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggleSelected(product.id)}
                    className="h-4 w-4 accent-accent-gold"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-bg-dark">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-text-muted-light">
                          <Gem className="h-4 w-4" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-text-primary-dark">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{product.sku}</td>
                <td className="px-4 py-3 text-text-muted">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {product.gemType?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-text-primary-dark">
                  {formatPrice(product.price, product.currency)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {product.stockStatus.replace("_", " ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.isActive
                        ? "rounded-full bg-success-bg px-2.5 py-1 text-xs text-success"
                        : "rounded-full bg-border px-2.5 py-1 text-xs text-text-muted"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-accent-gold hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {result && result.data.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No products match these filters.
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
