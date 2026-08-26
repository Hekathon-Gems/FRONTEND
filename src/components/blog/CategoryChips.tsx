"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { RefSlug } from "@/lib/types";

export function CategoryChips({ categories }: { categories: RefSlug[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  function selectCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => selectCategory(null)}
        className={clsx(
          "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.04em] transition-colors",
          !activeCategory
            ? "border-accent-gold bg-accent-gold text-bg-dark"
            : "border-border text-text-primary-dark hover:border-accent-gold",
        )}
      >
        All Articles
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => selectCategory(cat.slug)}
          className={clsx(
            "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.04em] transition-colors",
            activeCategory === cat.slug
              ? "border-accent-gold bg-accent-gold text-bg-dark"
              : "border-border text-text-primary-dark hover:border-accent-gold",
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
