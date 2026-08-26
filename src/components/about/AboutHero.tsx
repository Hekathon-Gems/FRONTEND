import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import type { AboutHeroBlock } from "@/lib/types";

export function AboutHero({ block }: { block: AboutHeroBlock }) {
  return (
    <section className="bg-bg-dark">
      <div className="mx-auto max-w-[900px] px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-xs text-text-muted-light">
          <Link href="/" className="hover:text-accent-gold">
            Home
          </Link>{" "}
          &gt; About Us
        </p>
        <h1 className="mx-auto mt-5 max-w-2xl font-heading text-4xl text-text-primary-light sm:text-5xl">
          {block.heading}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-text-muted-light sm:text-base">
          {block.body}
        </p>
        <LinkButton href={block.ctaHref} variant="accent" className="mt-8">
          {block.ctaLabel}
        </LinkButton>
      </div>
    </section>
  );
}
