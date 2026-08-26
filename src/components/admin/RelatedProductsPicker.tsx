"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-client";
import type { AdminProduct } from "@/lib/admin-types";

export function RelatedProductsPicker({
  selected,
  onChange,
  excludeId,
}: {
  selected: { id: string; name: string }[];
  onChange: (next: { id: string; name: string }[]) => void;
  excludeId?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminProduct[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const res = await getAdminProducts({ q: value });
    setResults(res.data.filter((p) => p.id !== excludeId));
  }

  function add(product: AdminProduct) {
    if (selected.some((s) => s.id === product.id)) return;
    onChange([...selected, { id: product.id, name: product.name }]);
    setQuery("");
    setResults([]);
  }

  function remove(id: string) {
    onChange(selected.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {selected.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-bg-cream px-3 py-1 text-xs text-text-primary-dark"
          >
            {item.name}
            <button type="button" onClick={() => remove(item.id)}>
              <X className="h-3 w-3" strokeWidth={2} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative mt-2">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products to add..."
          className="h-10 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-bg-white shadow-elevated">
            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => add(product)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-bg-cream"
              >
                {product.name}{" "}
                <span className="text-text-muted">({product.sku})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
