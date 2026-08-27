import { Gem, ShieldCheck, Globe } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Gem,
    title: "Expert Craftsmanship",
    body: "Precision cut for maximum brilliance.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Stones",
    body: "All gems come with authenticity certificate.",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    body: "Secure & insured delivery to your doorstep.",
  },
];

export function CustomGemsCta() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid grid-cols-1 gap-10 rounded-lg bg-bg-dark p-10 sm:p-16 lg:grid-cols-[3fr_2fr] lg:items-center">
        <div>
          <h2 className="font-heading text-2xl text-text-primary-light sm:text-3xl">
            Custom Gems, Crafted for You
          </h2>
          <p className="mt-4 max-w-md text-sm text-text-muted-light">
            Looking for something unique? We offer custom cuts and personalized
            gemstone selections.
          </p>
          <LinkButton href="/contact" variant="outline-gold" className="mt-6">
            Create Your Own Gem
          </LinkButton>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center sm:text-left">
                <Icon
                  className="mx-auto h-6 w-6 text-accent-gold sm:mx-0"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-sm font-medium text-text-primary-light">
                  {title}
                </p>
                <p className="mt-1 text-xs text-text-muted-light">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* No product photography exists in this project — a decorative
            panel stands in for a real photo of a gem being set. */}
        <div className="relative hidden aspect-square items-center justify-center overflow-hidden rounded-md border border-border-dark bg-gradient-to-br from-bg-dark-alt to-black lg:flex">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 65% 35%, rgba(201,162,75,0.3), transparent 55%)",
            }}
          />
          <Gem
            className="relative h-20 w-20 text-accent-gold/70"
            strokeWidth={0.75}
          />
        </div>
      </div>
    </section>
  );
}
