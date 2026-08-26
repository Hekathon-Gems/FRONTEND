"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "featured";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    router.push(`/gems?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-text-primary-dark">
      <span className="whitespace-nowrap text-text-muted">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="h-10 rounded-sm border border-border bg-bg-white px-2 text-sm focus:border-accent-gold focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
