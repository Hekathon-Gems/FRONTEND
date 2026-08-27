import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        aria-label="Previous page"
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-primary-dark hover:border-accent-gold",
          page === 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </Link>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-text-muted">…</span>}
            <Link
              href={buildHref(p)}
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm",
                p === page
                  ? "bg-bg-dark text-text-primary-light"
                  : "text-text-primary-dark hover:bg-bg-cream",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        aria-label="Next page"
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-primary-dark hover:border-accent-gold",
          page === totalPages && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    </nav>
  );
}
