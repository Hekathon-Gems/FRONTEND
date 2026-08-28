import { Camera, Gem } from "lucide-react";

const TILE_COUNT = 9;

export function InstagramStrip() {
  return (
    <div className="bg-bg-dark py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* No real Instagram photos exist in this project — a tiled grid
            of decorative gem icons stands in for a live feed embed. */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
          {Array.from({ length: TILE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center bg-bg-dark-alt text-accent-gold/50"
            >
              <Gem className="h-6 w-6" strokeWidth={1} />
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted-light">
          <Camera className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
          Follow us on Instagram{" "}
          <a
            href="https://instagram.com/hekathongems"
            className="text-accent-gold underline"
          >
            @hekathongems
          </a>
        </p>
      </div>
    </div>
  );
}
