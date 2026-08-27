import { ShieldCheck, Leaf, Gem, HeartHandshake, Sparkles } from "lucide-react";
import type { AboutValuesBlock } from "@/lib/types";

const ICONS: Record<string, typeof ShieldCheck> = {
  "shield-check": ShieldCheck,
  leaf: Leaf,
  gem: Gem,
  "heart-handshake": HeartHandshake,
};

export function ValuesGrid({ block }: { block: AboutValuesBlock }) {
  return (
    <section className="bg-bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold-text">
          {block.eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl text-text-primary-dark">
          {block.heading}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <div
                key={item.title}
                className="rounded-md bg-bg-white p-6 shadow-card"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/10 text-accent-gold">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <p className="mt-4 font-heading text-lg text-text-primary-dark">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
