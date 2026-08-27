"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Leaf, Gem } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const SLIDES = [
  {
    eyebrow: "NATURE'S TREASURES",
    heading: "Discover The World of Precious Gems",
    subhead:
      "Exquisite, ethically sourced gemstones curated for timeless beauty and brilliance.",
  },
  {
    eyebrow: "HANDPICKED QUALITY",
    heading: "Certified Stones, Timeless Brilliance",
    subhead:
      "Every gem is graded, certified, and selected for exceptional color and clarity.",
  },
  {
    eyebrow: "ONE OF A KIND",
    heading: "Rare Gems For Every Story",
    subhead:
      "From heirloom pieces to bold statements — find the stone that's meant for you.",
  },
];

const BADGES = [
  { icon: ShieldCheck, label: "Certified Authentic" },
  { icon: Leaf, label: "Ethically Sourced" },
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
    <section className="relative overflow-hidden bg-bg-dark">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(13,18,16,0.97), rgba(13,18,16,0.7)), radial-gradient(circle at 78% 35%, rgba(201,162,75,0.22), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-gold">
            {slide.eyebrow}
          </p>
          <h1 className="mt-5 max-w-xl font-heading text-4xl font-medium leading-[1.15] text-text-primary-light sm:text-5xl">
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

          {SLIDES.length > 1 && (
            <div className="mt-12 flex items-center gap-4">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`border-b pb-1 text-xs font-medium tracking-[0.05em] transition-colors ${
                    i === active
                      ? "border-accent-gold text-accent-gold"
                      : "border-transparent text-text-muted-light hover:text-text-primary-light"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* No product photography exists in this project (every catalog
            item has an empty images array) — this panel is a deliberate
            decorative placeholder rather than a real hero photo. */}
        <div className="relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border-dark bg-gradient-to-br from-bg-dark-alt to-bg-dark lg:flex">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(201,162,75,0.35), transparent 55%), radial-gradient(circle at 70% 70%, rgba(201,162,75,0.2), transparent 50%)",
            }}
          />
          <Gem
            className="relative h-28 w-28 text-accent-gold/70"
            strokeWidth={0.75}
          />

          <div className="absolute right-4 top-4 flex flex-col gap-2">
            {BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-md border border-border-dark bg-bg-dark/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-text-primary-light"
              >
                <Icon
                  className="h-3.5 w-3.5 text-accent-gold"
                  strokeWidth={1.5}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Same badges, stacked under the CTAs — visible on small screens
          where the decorative visual panel above is hidden. */}
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap gap-3 px-4 pb-8 sm:px-6 lg:hidden">
        {BADGES.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 rounded-md border border-border-dark bg-bg-dark/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-primary-light"
          >
            <Icon className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
