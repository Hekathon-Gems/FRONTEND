import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function PopularGemstones({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl text-text-primary-dark sm:text-3xl">
              Popular Gemstones
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Handpicked natural gemstones in stunning colors and excellent
              quality.
            </p>
          </div>
          <Link
            href="/gems"
            className="whitespace-nowrap text-sm text-accent-gold-text underline"
          >
            View all gems →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
