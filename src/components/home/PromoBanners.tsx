import Link from "next/link";

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col justify-end rounded-lg bg-bg-dark p-10 min-h-[220px]">
          <p className="max-w-xs text-sm text-text-muted-light">
            Explore our latest collection of rare and beautiful gems
          </p>
          <Link
            href="/gems?sort=newest"
            className="mt-3 text-sm font-medium text-accent-gold underline"
          >
            EXPLORE →
          </Link>
        </div>
        <div className="flex flex-col justify-end rounded-lg bg-bg-dark-alt p-10 min-h-[220px]">
          <p className="max-w-xs text-sm text-text-muted-light">
            Perfect gemstones for every special occasion
          </p>
          <Link
            href="/collections"
            className="mt-3 text-sm font-medium text-accent-gold underline"
          >
            EXPLORE →
          </Link>
        </div>
      </div>
    </section>
  );
}
