import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { StatsRow } from "@/components/about/StatsRow";
import { CommitmentSection } from "@/components/about/CommitmentSection";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { getAboutContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "About Us | Gemora Fine Gems",
  description:
    "Gemora Fine Gems is a premier destination for exquisite, ethically sourced gemstones — a heritage of trust since 1888.",
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <>
      {content.hero && <AboutHero block={content.hero} />}
      {content.our_story && <OurStory block={content.our_story} />}
      {content.values && <ValuesGrid block={content.values} />}
      {content.stats && <StatsRow block={content.stats} />}
      {content.commitment && <CommitmentSection block={content.commitment} />}

      <div className="bg-bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-2xl text-text-primary-dark">
            Stay Updated with Gemora
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Get the latest collections, stories and exclusive offers.
          </p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm dark={false} />
          </div>
        </div>
      </div>
    </>
  );
}
