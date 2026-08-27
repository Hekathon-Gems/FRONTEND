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
            className="group flex flex-col items-center rounded-md bg-bg-dark px-4 py-10 text-center transition-transform hover:-translate-y-0.5"
          >
            <Gem className="h-8 w-8 text-accent-gold" strokeWidth={1.25} />
            <p className="mt-4 font-heading text-sm text-text-primary-light">
              {cat.name}
            </p>
            <span className="mt-2 text-xs text-accent-gold opacity-0 transition-opacity group-hover:opacity-100">
              Explore Now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
