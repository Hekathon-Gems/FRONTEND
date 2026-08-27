import Link from "next/link";
import { Gem } from "lucide-react";
import type { CategoryWithCount } from "@/lib/types";

export function ShopByCategory({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-2xl text-text-primary-dark sm:text-3xl">
          Shop By Category
        </h2>
        <Link href="/gems" className="text-sm text-accent-gold-text underline">
          View all categories →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {categories.slice(0, 5).map((cat) => (
          <Link
            key={cat.slug}
            href={`/gems?category=${cat.slug}`}
            className="group flex flex-col items-center rounded-md bg-bg-cream px-4 py-8 text-center shadow-card transition-shadow hover:shadow-elevated"
          >
            {/* No category photography exists in this project — a
                decorative circle stands in for a real product photo. */}
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-white text-accent-gold shadow-card">
              <Gem className="h-8 w-8" strokeWidth={1.25} />
            </span>
            <p className="mt-4 font-heading text-sm text-text-primary-dark">
              {cat.name}
            </p>
            <span className="mt-1.5 text-xs text-accent-gold-text underline">
              Explore Now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
