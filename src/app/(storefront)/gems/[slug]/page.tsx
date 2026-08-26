import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck, Truck, RotateCcw, Headset, Gem } from "lucide-react";
import {
  getProduct,
  getProducts,
  getRelatedProducts,
  NotFoundApiError,
} from "@/lib/api";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SpecTable } from "@/components/product/SpecTable";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Accordion } from "@/components/ui/Accordion";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { formatPrice, stockStatusLabel } from "@/lib/format";

export const revalidate = 60;

export async function generateStaticParams() {
  const { data } = await getProducts({ limit: "100" }).catch(() => ({
    data: [],
  }));
  return data.map((product) => ({ slug: product.slug }));
}

const PDP_TRUST_ICONS = [
  { icon: Gem, label: "100% Natural Gemstone" },
  { icon: ShieldCheck, label: "Secure Payment — 100% Protected" },
  { icon: Truck, label: "Free Shipping Worldwide" },
  { icon: RotateCcw, label: "Easy Returns — 7 Days Return" },
];

const DARK_TRUST_BAR = [
  {
    icon: ShieldCheck,
    title: "Certified Authentic",
    body: "Comes with an official gemstone certificate",
  },
  {
    icon: Truck,
    title: "Secure & Insured Shipping",
    body: "Your order is safely packed and fully insured",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    body: "7 days easy returns for a hassle-free experience",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    body: "We're here to help you anytime",
  },
];

async function loadProduct(slug: string) {
  try {
    return await getProduct(slug);
  } catch (err) {
    if (err instanceof NotFoundApiError) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/gems/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Gem Not Found | Gemora Fine Gems" };
  return {
    title: `${product.name} | Gemora Fine Gems`,
    description:
      product.shortDescription ?? product.longDescription ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/gems/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug).catch(() => []);
  const isLowStock = product.stockStatus === "low_stock";
  const isInStock = product.stockStatus === "in_stock";

  const accordionItems = [
    {
      title: `About ${product.gemType?.name ?? product.name}`,
      content: product.longDescription ?? (
        <p>
          {product.gemType?.name ?? "This gemstone"} is prized for its natural
          beauty and brilliance, expertly selected and cut to enhance its fire
          and color.
        </p>
      ),
    },
    {
      title: "Care & Cleaning",
      content:
        "Clean gently with warm water and a soft brush. Avoid harsh chemicals and ultrasonic cleaners unless recommended for this gemstone type. Store separately to prevent scratching.",
    },
    {
      title: "Shipping Information",
      content:
        "All orders are securely packed and fully insured. Free worldwide shipping is included on every gemstone.",
    },
    {
      title: "Returns & Refunds",
      content:
        "7 days easy returns for a hassle-free experience. See our Returns policy for details.",
    },
    {
      title: "Certification",
      content: product.certificationBody
        ? `Certified by ${product.certificationBody}.`
        : "Certification details are available on request.",
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6">
        <p className="text-xs text-text-muted">
          <Link href="/" className="hover:text-accent-gold">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/gems" className="hover:text-accent-gold">
            Gems
          </Link>
          {product.gemType?.name && (
            <>
              {" "}
              &gt;{" "}
              <Link
                href={`/gems?gemType=${product.gemType.slug}`}
                className="hover:text-accent-gold"
              >
                {product.gemType.name}
              </Link>
            </>
          )}{" "}
          &gt; {product.name}
        </p>
      </div>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-gold-dark">
            Certified & Authentic
          </span>
          <h1 className="mt-4 font-heading text-3xl text-text-primary-dark">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-text-primary-dark">
            {formatPrice(product.price, product.currency)}
          </p>

          <p className="mt-3 flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                isInStock
                  ? "bg-success"
                  : isLowStock
                    ? "bg-warning"
                    : "bg-danger"
              }`}
            />
            <span
              className={
                isInStock
                  ? "text-success"
                  : isLowStock
                    ? "text-warning"
                    : "text-danger"
              }
            >
              {stockStatusLabel(product.stockStatus)}
            </span>
          </p>

          {product.shortDescription && (
            <p className="mt-5 text-sm leading-relaxed text-text-muted">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {PDP_TRUST_ICONS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-xs text-text-muted"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-accent-gold"
                  strokeWidth={1.5}
                />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <SpecTable product={product} />
          </div>

          <div className="mt-8">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </section>

      <div className="bg-bg-dark-alt">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {DARK_TRUST_BAR.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon
                className="h-6 w-6 shrink-0 text-accent-gold"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-sm font-medium text-text-primary-light">
                  {title}
                </p>
                <p className="mt-1 text-xs text-text-muted-light">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RelatedProducts products={related} />

      <div className="bg-bg-dark">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-2xl text-text-primary-light">
            Stay Inspired
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted-light">
            Subscribe to our newsletter for the latest collections, gemstone
            insights, and exclusive offers.
          </p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </>
  );
}
