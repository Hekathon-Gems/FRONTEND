import { MapPin } from "lucide-react";

const SHOWROOM_ADDRESS = "123 Gem Street, New York, NY 10001, USA";
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOWROOM_ADDRESS)}`;

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-white">
      <div className="relative aspect-[16/9] bg-bg-cream">
        {MAPS_API_KEY ? (
          <iframe
            title="Gemora Fine Gems showroom map"
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${encodeURIComponent(SHOWROOM_ADDRESS)}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
            <MapPin className="h-8 w-8" strokeWidth={1.25} />
            <span className="text-xs">
              Map unavailable — Google Maps API key not configured
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-heading text-base text-text-primary-dark">
          Our Showroom
        </p>
        <p className="mt-1 text-sm text-text-muted">{SHOWROOM_ADDRESS}</p>
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-accent-gold-text underline"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}
