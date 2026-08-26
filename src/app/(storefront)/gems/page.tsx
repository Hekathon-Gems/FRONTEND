import Link from "next/link";
import { ShieldCheck, Leaf, Gem, Truck } from "lucide-react";
import { getProducts, getCategories, getGemTypes, getShapes } from "@/lib/api";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";
import { LinkButton } from "@/components/ui/Button";
import type { CatalogQuery } from "@/lib/types";

const HERO_ICONS = [
  { icon: Gem, label: "100% Natural Gemstones" },
  { icon: ShieldCheck, label: "Certified Authentic" },
  { icon: Leaf, label: "Ethically Sourced" },
  { icon: Truck, label: "Worldwide Shipping" },
];

const TRUST_STRIP = [
  {
    title: "Certified Authenticity",
    body: "Every gemstone comes with a certificate of authenticity",
  },
  {
    title: "Ethically Sourced",
    body: "We ensure responsible mining and fair trade practices",
  },
  {
    title: "Expert Guidance",
    body: "Our gem experts are here to help you choose the perfect gem",
  },
  {
    title: "Secure Delivery",
    body: "Safe & insured shipping to your doorstep",
  },
];

export const metadata = {
  title: "Gems | Gemora Fine Gems",
  description:
    "Browse certified loose gemstones — handpicked, ethically sourced, and ready to ship.",
};

export default async function CatalogPage({
  searchParams,
}: PageProps<"/gems">) {
  const sp = await searchParams;
  const query: CatalogQuery = {
    category: first(sp.category),
    gemType: first(sp.gemType),
    shape: first(sp.shape),
    minPrice: first(sp.minPrice),
    maxPrice: first(sp.maxPrice),
    collection: first(sp.collection),
    q: first(sp.q),
    sort: first(sp.sort),
    page: first(sp.page) ?? "1",
    limit: "12",
  };

  const [listResponse, categories, gemTypes, shapes] = await Promise.all([
    getProducts(query),
    getCategories(),
    getGemTypes(),
    getShapes(),
  ]);

  const { data: products, meta } = listResponse;
  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      const v = first(value);
      if (v && key !== "page") params.set(key, v);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/gems?${qs}` : "/gems";
  }

  return (
    <>
      <section className="bg-bg-dark">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs text-text-muted-light">
            <Link href="/" className="hover:text-accent-gold">
              Home
            </Link>{" "}
            &gt; Gems
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-heading text-3xl text-text-primary-light sm:text-4xl">
            Discover The World of Precious Gems
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted-light">
            Handpicked natural gemstones in stunning colors and exceptional
            quality.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {HERO_ICONS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.05em] text-text-muted-light"
              >
                <Icon className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <FilterSidebar
            categories={categories}
            gemTypes={gemTypes}
            shapes={shapes}
          />

          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl text-text-primary-dark">
                  All Gemstones
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  {meta.total > 0
                    ? `Showing ${from}–${to} of ${meta.total} results`
                    : "Showing 0 results"}
                </p>
              </div>
              <SortSelect />
            </div>

            <ProductGrid products={products} />

            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              buildHref={buildHref}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {TRUST_STRIP.map((item) => (
            <div key={item.title}>
              <p className="font-heading text-base text-text-primary-dark">
                {item.title}
              </p>
              <p className="mt-2 text-sm text-text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-heading text-2xl text-text-primary-dark sm:text-3xl">
          Looking for Something Extraordinary?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted">
          We offer custom gemstone sourcing and bespoke cutting services to
          bring your vision to life.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs font-medium uppercase tracking-[0.05em] text-text-muted">
          <span>Custom Sourcing</span>
          <span>Precision Cutting</span>
          <span>Personalized Service</span>
        </div>
        <LinkButton href="/contact" variant="primary" className="mt-8">
          Consult Our Experts
        </LinkButton>
      </section>
    </>
  );
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
