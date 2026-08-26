import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import type { AboutCommitmentBlock } from "@/lib/types";

export function CommitmentSection({ block }: { block: AboutCommitmentBlock }) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
            {block.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl text-text-primary-dark">
            {block.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
            {block.body}
          </p>

          <ul className="mt-6 space-y-3">
            {block.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-text-primary-dark"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold"
                  strokeWidth={2}
                />
                {item}
              </li>
            ))}
          </ul>

          <LinkButton href={block.ctaHref} variant="primary" className="mt-8">
            {block.ctaLabel}
          </LinkButton>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-bg-dark" />
          ))}
        </div>
      </div>
    </section>
  );
}
