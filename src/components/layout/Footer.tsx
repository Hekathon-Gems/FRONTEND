import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { TrustBar } from "./TrustBar";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Shop",
      links: [
        { label: "All Gems", href: "/gems" },
        { label: "Precious Gems", href: "/gems?category=precious-gems" },
        {
          label: "Semi Precious Gems",
          href: "/gems?category=semi-precious-gems",
        },
        { label: "Birthstones", href: "/gems?category=birthstones" },
        { label: "New Arrivals", href: "/gems?sort=newest" },
      ],
    },
    {
      heading: "Information",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      heading: "Customer Service",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Delivery", href: "/shipping" },
        { label: "Returns", href: "/returns" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

export function Footer() {
  return (
    <footer className="bg-bg-dark text-text-muted-light">
      <TrustBar />

      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-heading text-lg font-medium tracking-[0.15em] text-text-primary-light"
            >
              GEMORA <span className="text-accent-gold">FINE GEMS</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm">
              Nature&apos;s treasures, crafted for your most precious moments.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-text-primary-light">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-accent-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-text-primary-light">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>+1 (800) 123 4567</li>
              <li>hello@gemora.com</li>
              <li>123 Gem Street, New York, NY 10001, USA</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border-dark pt-10">
          <h3 className="font-heading text-xl font-medium text-text-primary-light">
            Stay Inspired
          </h3>
          <p className="mt-2 max-w-md text-sm">
            Subscribe to our newsletter for the latest collections, gemstone
            insights, and exclusive offers.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 border-t border-border-dark pt-6 text-xs">
          © 2024 Gemora Fine Gems. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
