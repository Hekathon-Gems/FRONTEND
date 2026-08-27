"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Gem } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Solid fills with a white/dark icon (rather than a color-on-tint pairing)
// so every swatch clears WCAG's 3:1 non-text contrast minimum — citrine is
// light enough that a white icon would fail, so it gets a dark one instead.
const GEM_COLOR_CLASSES: Record<string, string> = {
  ruby: "bg-gem-ruby text-white",
  sapphire: "bg-gem-sapphire text-white",
  "yellow-sapphire": "bg-gem-sapphire text-white",
  emerald: "bg-gem-emerald text-white",
  amethyst: "bg-gem-amethyst text-white",
  citrine: "bg-gem-citrine text-bg-dark",
};

const GEM_TAGLINES: Record<string, string> = {
  ruby: "The Gem of Passion",
  sapphire: "The Gem of Wisdom",
  "yellow-sapphire": "The Gem of Wisdom",
  emerald: "The Gem of Love",
  citrine: "The Gem of Positivity",
  amethyst: "The Gem of Peace",
  aquamarine: "The Gem of Courage",
  garnet: "The Gem of Devotion",
  topaz: "The Gem of Strength",
  "blue-topaz": "The Gem of Strength",
  tourmaline: "The Gem of Balance",
  moonstone: "The Gem of Intuition",
};

export function PopularGemstones({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="bg-bg-dark">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-text-primary-light sm:text-3xl">
              Popular Gemstones
            </h2>
            <p className="mt-2 text-sm text-text-muted-light">
              Handpicked natural gemstones in stunning colors and excellent
              quality.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/gems"
              className="whitespace-nowrap text-sm text-accent-gold-text underline"
            >
              View all gems →
            </Link>
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollBy(-240)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-dark text-text-primary-light transition-colors hover:border-accent-gold"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollBy(240)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-dark text-text-primary-light transition-colors hover:border-accent-gold"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => {
            const slug = product.gemType?.slug ?? "";
            const colorClasses =
              GEM_COLOR_CLASSES[slug] ?? "bg-accent-gold text-bg-dark";
            const tagline = GEM_TAGLINES[slug] ?? "A Timeless Natural Gem";
            return (
              <Link
                key={product.id}
                href={`/gems/${product.slug}`}
                className="group flex w-32 shrink-0 flex-col items-center text-center"
              >
                {/* No gemstone photography exists in this project — a
                    color-tinted circle stands in for a real close-up
                    photo of the stone. */}
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${colorClasses}`}
                >
                  <Gem className="h-9 w-9" strokeWidth={1.25} />
                </span>
                <p className="mt-4 font-heading text-sm text-text-primary-light">
                  {product.gemType?.name ?? product.name}
                </p>
                <p className="mt-1 text-xs text-text-muted-light">{tagline}</p>
                <p className="mt-1.5 text-xs font-medium text-accent-gold">
                  From {formatPrice(product.price, product.currency)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
