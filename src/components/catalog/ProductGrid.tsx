"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Gem } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export function ProductGrid({ products }: { products: Product[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (products.length === 0) {
    return (
      <div className="rounded-md border border-border bg-bg-white p-12 text-center">
        <p className="text-base text-text-primary-dark">
          No gemstones match your filters. Try adjusting your price range or
          clearing a filter.
        </p>
        <Link href="/gems">
          <Button variant="outline" className="mt-5">
            Clear All Filters
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex justify-end gap-1">
        <button
          type="button"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => setView("grid")}
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-md border",
            view === "grid"
              ? "border-accent-gold text-accent-gold"
              : "border-border text-text-muted",
          )}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="List view"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-md border",
            view === "list"
              ? "border-accent-gold text-accent-gold"
              : "border-border text-text-muted",
          )}
        >
          <List className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => {
            const image = product.images[0];
            return (
              <Link
                key={product.id}
                href={`/gems/${product.slug}`}
                className="flex gap-4 rounded-md bg-bg-white p-4 shadow-card"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md bg-bg-dark">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText ?? product.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-muted-light">
                      <Gem className="h-8 w-8" strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="font-heading text-base text-text-primary-dark">
                    {product.name}
                  </p>
                  {product.gemType?.name && (
                    <p className="mt-1 text-xs text-text-muted">
                      {product.gemType.name}
                    </p>
                  )}
                  {product.shortDescription && (
                    <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                      {product.shortDescription}
                    </p>
                  )}
                  <p className="mt-2 text-[15px] font-semibold text-text-primary-dark">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
