import { LinkButton } from "@/components/ui/Button";

const BIRTHSTONES = [
  { month: "Jan", stone: "Garnet", color: "#8a1f2b" },
  { month: "Feb", stone: "Amethyst", color: "#7e4fa3" },
  { month: "Mar", stone: "Aquamarine", color: "#3f8fa8" },
  { month: "Apr", stone: "Diamond", color: "#d8d8d2" },
  { month: "May", stone: "Emerald", color: "#1b8a5a" },
  { month: "Jun", stone: "Pearl", color: "#f2ede0" },
  { month: "Jul", stone: "Ruby", color: "#c0233a" },
  { month: "Aug", stone: "Peridot", color: "#7a9a2e" },
  { month: "Sep", stone: "Sapphire", color: "#1e4fa3" },
  { month: "Oct", stone: "Opal", color: "#c7d6d6" },
  { month: "Nov", stone: "Citrine", color: "#d99a2b" },
  { month: "Dec", stone: "Turquoise", color: "#1f9d8a" },
];

export function BirthstoneCollection() {
  return (
    <section className="bg-bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-heading text-2xl text-text-primary-dark sm:text-3xl">
          Birthstone Collection
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
          Find the perfect gemstone that represents your birth month.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {BIRTHSTONES.map((b) => (
            <a
              key={b.month}
              href={`/gems?gemType=${b.stone.toLowerCase()}`}
              className="flex flex-col items-center gap-3 rounded-md border border-border px-3 py-6 transition-colors hover:border-accent-gold"
            >
              <span
                className="h-6 w-6 rounded-full border border-border"
                style={{ backgroundColor: b.color }}
              />
              <span>
                <p className="text-xs uppercase tracking-[0.1em] text-text-muted">
                  {b.month}
                </p>
                <p className="mt-1 font-heading text-sm text-text-primary-dark">
                  {b.stone}
                </p>
              </span>
            </a>
          ))}
        </div>

        <LinkButton
          href="/gems?collection=birthstones"
          variant="outline"
          className="mt-10"
        >
          Explore Birthstones
        </LinkButton>
      </div>
    </section>
  );
}
