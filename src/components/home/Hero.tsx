"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Leaf } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const SLIDES = [
  {
    eyebrow: "NATURE'S TREASURES",
    heading: "Discover The World of Precious Gems",
    subhead:
      "Exquisite, ethically sourced gemstones curated for timeless beauty and brilliance.",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-bg-dark">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(13,18,16,0.95), rgba(13,18,16,0.55)), radial-gradient(circle at 75% 30%, rgba(201,162,75,0.18), transparent 60%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-24 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-gold">
          {slide.eyebrow}
        </p>
        <h1 className="mt-5 max-w-2xl font-heading text-4xl font-medium leading-[1.15] text-text-primary-light sm:text-5xl">
          {slide.heading}
        </h1>
        <p className="mt-5 max-w-lg text-base text-text-muted-light">
          {slide.subhead}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <LinkButton href="/gems" variant="accent">
            Shop Gems
          </LinkButton>
          <LinkButton href="/collections" variant="outline-light">
            Explore Collections
          </LinkButton>
        </div>

        <div className="mt-10 flex flex-wrap gap-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.06em] text-text-muted-light">
            <ShieldCheck
              className="h-4 w-4 text-accent-gold"
              strokeWidth={1.5}
            />
            Certified Authentic
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.06em] text-text-muted-light">
            <Leaf className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
            Ethically Sourced
          </span>
        </div>
      </div>

      {SLIDES.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active
                  ? "w-6 bg-accent-gold"
                  : "w-1.5 bg-text-muted-light/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
