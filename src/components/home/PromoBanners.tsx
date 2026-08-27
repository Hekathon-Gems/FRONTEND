import Link from "next/link";
import { Gem, Gift } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const PROMOS = [
  {
    icon: Gem,
    title: "New Arrivals",
    body: "Explore our latest collection of rare and beautiful gems.",
    href: "/gems?sort=newest",
  },
  {
    icon: Gift,
    title: "Gift Collection",
    body: "Perfect gemstones for every special occasion.",
    href: "/collections",
  },
];

export function PromoBanners() {
  return (
    <section className="bg-bg-dark">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_2fr_minmax(0,1fr)] lg:items-center">
        <div className="flex flex-col gap-5">
          {PROMOS.map(({ icon: Icon, title, body, href }) => (
            <div
              key={title}
              className="rounded-lg border border-border-dark bg-bg-dark-alt p-6"
            >
              <Icon className="h-6 w-6 text-accent-gold" strokeWidth={1.5} />
              <p className="mt-3 font-heading text-base text-text-primary-light">
                {title}
              </p>
              <p className="mt-1 text-xs text-text-muted-light">{body}</p>
              <Link
                href={href}
                className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.06em] text-accent-gold underline"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="font-heading text-2xl text-text-primary-light sm:text-3xl">
            Timeless Beauty. Trusted Since 1888.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-text-muted-light sm:text-base">
            For over 135 years, Gemora has been passionate about sourcing the
            world&apos;s most exquisite gemstones and bringing their natural
            beauty to life.
          </p>
          <LinkButton href="/about" variant="outline-light" className="mt-8">
            About Our Heritage
          </LinkButton>
        </div>

        {/* No product photography exists in this project — a decorative
            panel stands in for a real heritage photo. */}
        <div className="relative hidden aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border border-border-dark bg-gradient-to-br from-bg-dark-alt to-black lg:flex">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 35% 40%, rgba(201,162,75,0.3), transparent 55%)",
            }}
          />
          <Gem
            className="relative h-16 w-16 text-accent-gold/70"
            strokeWidth={0.75}
          />
        </div>
      </div>
    </section>
  );
}
