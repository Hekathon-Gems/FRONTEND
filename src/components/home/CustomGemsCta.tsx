import { Hammer, ShieldCheck, Truck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Hammer,
    title: "Expert Craftsmanship",
    body: "Precision cut for maximum brilliance",
  },
  {
    icon: ShieldCheck,
    title: "Certified Stones",
    body: "All gems come with authenticity certificate",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    body: "Secure & insured delivery to your doorstep",
  },
];

export function CustomGemsCta() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-10 rounded-lg bg-bg-dark p-10 sm:p-16 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl text-text-primary-light sm:text-3xl">
            Custom Gems, Crafted for You
          </h2>
          <p className="mt-4 max-w-md text-sm text-text-muted-light">
            Looking for something unique? We offer custom cuts and personalized
            gemstone selections.
          </p>
          <LinkButton href="/contact" variant="accent" className="mt-6">
            Create Your Own Gem
          </LinkButton>
        </div>
        <div className="flex flex-col gap-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4">
              <Icon
                className="h-6 w-6 shrink-0 text-accent-gold"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-sm font-medium text-text-primary-light">
                  {title}
                </p>
                <p className="mt-1 text-xs text-text-muted-light">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
