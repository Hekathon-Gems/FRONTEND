import Link from "next/link";
import { Search, User, Heart } from "lucide-react";
import { CartIndicator } from "./CartIndicator";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gems", href: "/gems" },
  { label: "Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
  { label: "Education", href: "/education" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-dark bg-bg-dark">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-medium tracking-[0.15em] text-text-primary-light"
        >
          GEMORA <span className="text-accent-gold">FINE GEMS</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.04em] text-text-muted-light transition-colors hover:text-accent-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            title="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-text-primary-light transition-colors hover:text-accent-gold sm:inline-flex"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            title="Account"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-text-primary-light transition-colors hover:text-accent-gold sm:inline-flex"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            title="Wishlist"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-text-primary-light transition-colors hover:text-accent-gold sm:inline-flex"
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <CartIndicator />
        </div>
      </div>
    </header>
  );
}
