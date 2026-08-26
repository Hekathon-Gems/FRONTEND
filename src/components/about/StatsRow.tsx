import type { AboutStatsBlock } from "@/lib/types";

export function StatsRow({ block }: { block: AboutStatsBlock }) {
  return (
    <section className="bg-bg-dark">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 py-16 text-center sm:px-6 lg:grid-cols-4">
        {block.items.map((item) => (
          <div key={item.label}>
            <p className="font-heading text-3xl text-accent-gold sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.08em] text-text-muted-light sm:text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
