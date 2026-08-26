import { Gem } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import type { AboutStoryBlock } from "@/lib/types";

export function OurStory({ block }: { block: AboutStoryBlock }) {
  return (
    <section
      id="story"
      className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-bg-dark text-text-muted-light">
          <Gem className="h-16 w-16" strokeWidth={1} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            {block.eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-3xl text-text-primary-dark">
            {block.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
            {block.body}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <LinkButton href={block.ctaHref} variant="primary">
              {block.ctaLabel}
            </LinkButton>
            <span className="font-heading text-lg text-accent-gold">
              {block.statBadge}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
