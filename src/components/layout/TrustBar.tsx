import { Gem, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const ITEMS = [
  { icon: Gem, label: "100% Natural Gems", sub: "Certified & Authentic" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "100% Protected" },
  { icon: RotateCcw, label: "Easy Returns", sub: "7 Days Return" },
  { icon: Headset, label: "24/7 Support", sub: "We're Here to Help" },
];

export function TrustBar() {
  return (
    <div className="border-y border-border-dark bg-bg-dark-alt">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon
              className="h-6 w-6 shrink-0 text-accent-gold"
              strokeWidth={1.5}
            />
            <div>
              <p className="text-sm font-medium text-text-primary-light">
                {label}
              </p>
              <p className="text-xs text-text-muted-light">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
