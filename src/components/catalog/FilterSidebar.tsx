"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import type { CategoryWithCount, RefSlug } from "@/lib/types";

const SHOW_MORE_THRESHOLD = 8;

function toggleInList(current: string | null, slug: string): string[] {
  const list = current ? current.split(",").filter(Boolean) : [];
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
}

export function FilterSidebar({
  categories,
  gemTypes,
  shapes,
}: {
  categories: CategoryWithCount[];
  gemTypes: CategoryWithCount[];
  shapes: RefSlug[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAllGemTypes, setShowAllGemTypes] = useState(false);
  const [showAllShapes, setShowAllShapes] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const activeCategory = searchParams.get("category");
  const activeGemTypes =
    searchParams.get("gemType")?.split(",").filter(Boolean) ?? [];
  const activeShapes =
    searchParams.get("shape")?.split(",").filter(Boolean) ?? [];

  function pushParam(key: string, value: string | string[] | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    router.push(`/gems?${params.toString()}`);
  }

  function applyPriceRange() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    router.push(`/gems?${params.toString()}`);
  }

  const hasActiveFilters =
    activeCategory ||
    activeGemTypes.length > 0 ||
    activeShapes.length > 0 ||
    minPrice ||
    maxPrice;

  const visibleGemTypes = showAllGemTypes
    ? gemTypes
    : gemTypes.slice(0, SHOW_MORE_THRESHOLD);
  const visibleShapes = showAllShapes
    ? shapes
    : shapes.slice(0, SHOW_MORE_THRESHOLD);

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-text-primary-dark">Filters</h2>
        {hasActiveFilters && (
          <Link
            href="/gems"
            className="text-xs text-accent-gold hover:underline"
          >
            Clear All
          </Link>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          Category
        </h3>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() =>
                  pushParam(
                    "category",
                    activeCategory === cat.slug ? null : cat.slug,
                  )
                }
                className={clsx(
                  "flex w-full items-center justify-between text-sm",
                  activeCategory === cat.slug
                    ? "font-semibold text-accent-gold"
                    : "text-text-primary-dark hover:text-accent-gold",
                )}
              >
                <span>{cat.name}</span>
                <span className="text-text-muted">({cat.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          Gem Type
        </h3>
        <ul className="mt-3 space-y-2">
          {visibleGemTypes.map((type) => (
            <li key={type.slug}>
              <label className="flex items-center gap-2 text-sm text-text-primary-dark">
                <input
                  type="checkbox"
                  checked={activeGemTypes.includes(type.slug)}
                  onChange={() =>
                    pushParam(
                      "gemType",
                      toggleInList(searchParams.get("gemType"), type.slug),
                    )
                  }
                  className="h-4 w-4 rounded-sm border-border accent-accent-gold"
                />
                {type.name}{" "}
                <span className="text-text-muted">({type.count})</span>
              </label>
            </li>
          ))}
        </ul>
        {gemTypes.length > SHOW_MORE_THRESHOLD && (
          <button
            type="button"
            onClick={() => setShowAllGemTypes((v) => !v)}
            className="mt-2 text-xs text-accent-gold hover:underline"
          >
            {showAllGemTypes ? "Show Less" : "+ Show More"}
          </button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          Shape
        </h3>
        <ul className="mt-3 space-y-2">
          {visibleShapes.map((shape) => (
            <li key={shape.slug}>
              <label className="flex items-center gap-2 text-sm text-text-primary-dark">
                <input
                  type="checkbox"
                  checked={activeShapes.includes(shape.slug)}
                  onChange={() =>
                    pushParam(
                      "shape",
                      toggleInList(searchParams.get("shape"), shape.slug),
                    )
                  }
                  className="h-4 w-4 rounded-sm border-border accent-accent-gold"
                />
                {shape.name}
              </label>
            </li>
          ))}
        </ul>
        {shapes.length > SHOW_MORE_THRESHOLD && (
          <button
            type="button"
            onClick={() => setShowAllShapes((v) => !v)}
            className="mt-2 text-xs text-accent-gold hover:underline"
          >
            {showAllShapes ? "Show Less" : "+ Show More"}
          </button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          Price Range
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="$50"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-10 w-full rounded-sm border border-border px-2 text-sm focus:border-accent-gold focus:outline-none"
          />
          <span className="text-text-muted">—</span>
          <input
            type="number"
            min={0}
            placeholder="$10,000+"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-10 w-full rounded-sm border border-border px-2 text-sm focus:border-accent-gold focus:outline-none"
          />
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={applyPriceRange}
        >
          Apply Filter
        </Button>
      </div>

      <div className="mt-10 rounded-md bg-bg-dark p-6 text-text-primary-light">
        <p className="font-heading text-base">Need Something Unique?</p>
        <p className="mt-2 text-sm text-text-muted-light">
          We offer custom cutting and bespoke gemstone sourcing tailored just
          for you.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-md bg-accent-gold px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-bg-dark hover:bg-accent-gold-dark"
        >
          Create Custom Gem
        </Link>
      </div>
    </aside>
  );
}
