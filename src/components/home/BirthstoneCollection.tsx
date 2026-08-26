import { LinkButton } from "@/components/ui/Button";

const BIRTHSTONES = [
  { month: "Jan", stone: "Garnet" },
  { month: "Feb", stone: "Amethyst" },
  { month: "Mar", stone: "Aquamarine" },
  { month: "Apr", stone: "Diamond" },
  { month: "May", stone: "Emerald" },
  { month: "Jun", stone: "Pearl" },
  { month: "Jul", stone: "Ruby" },
  { month: "Aug", stone: "Peridot" },
  { month: "Sep", stone: "Sapphire" },
  { month: "Oct", stone: "Opal" },
  { month: "Nov", stone: "Citrine" },
  { month: "Dec", stone: "Turquoise" },
];

export function BirthstoneCollection() {
  return (
    <section className="bg-bg-dark-alt">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-heading text-2xl text-text-primary-light sm:text-3xl">
          Birthstone Collection
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted-light">
          Find the perfect gemstone that represents your birth month.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {BIRTHSTONES.map((b) => (
            <a
              key={b.month}
              href={`/gems?gemType=${b.stone.toLowerCase()}`}
              className="rounded-md border border-border-dark px-3 py-6 transition-colors hover:border-accent-gold"
            >
              <p className="text-xs uppercase tracking-[0.1em] text-text-muted-light">
                {b.month}
              </p>
              <p className="mt-1 font-heading text-sm text-text-primary-light">
                {b.stone}
              </p>
            </a>
          ))}
        </div>

        <LinkButton
          href="/gems?collection=birthstones"
          variant="accent"
          className="mt-10"
        >
          Explore Birthstones
        </LinkButton>
      </div>
    </section>
  );
}
