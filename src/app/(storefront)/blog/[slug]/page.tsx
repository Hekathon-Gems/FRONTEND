import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getBlogPost, getBlogPosts, NotFoundApiError } from "@/lib/api";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import type { BlogPost } from "@/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const { data } = await getBlogPosts({ limit: "100" }).catch(() => ({
    data: [],
  }));
  return data.map((post) => ({ slug: post.slug }));
}

async function loadPost(slug: string) {
  try {
    return await getBlogPost(slug);
  } catch (err) {
    if (err instanceof NotFoundApiError) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Article Not Found | Gemora Fine Gems" };
  return {
    title: `${post.title} | Gemora Fine Gems`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
  };
}

function buildArticleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.featuredImageUrl ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    author: post.author
      ? {
          "@type": "Person",
          name: `${post.author.firstName} ${post.author.lastName}`,
        }
      : { "@type": "Organization", name: "Gemora Fine Gems" },
    publisher: {
      "@type": "Organization",
      name: "Gemora Fine Gems",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };
}

function buildBreadcrumbJsonLd(post: BlogPost) {
  const items = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={buildArticleJsonLd(post)} />
      <JsonLd data={buildBreadcrumbJsonLd(post)} />

      <p className="text-xs text-text-muted">
        <Link href="/" className="hover:text-accent-gold">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link href="/blog" className="hover:text-accent-gold">
          Blog
        </Link>{" "}
        &gt; {post.title}
      </p>

      {post.category?.name && (
        <span className="mt-4 inline-block rounded-full bg-accent-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-gold-text">
          {post.category.name}
        </span>
      )}

      <h1 className="mt-4 font-heading text-3xl text-text-primary-dark sm:text-4xl">
        {post.title}
      </h1>

      <p className="mt-3 text-sm text-text-muted">
        {formatDate(post.publishedAt)}
        {post.readTimeMinutes ? ` · ${post.readTimeMinutes} min read` : ""}
        {post.author
          ? ` · By ${post.author.firstName} ${post.author.lastName}`
          : ""}
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-md bg-bg-dark">
        {post.featuredImageUrl ? (
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            fill
            sizes="768px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted-light">
            <BookOpen className="h-10 w-10" strokeWidth={1} />
          </div>
        )}
      </div>

      {post.bodyHtml && (
        <div
          className="mt-8 text-[15px] leading-relaxed text-text-primary-dark [&_a]:text-accent-gold-text [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-muted [&_em]:italic [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:text-text-primary-dark [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:text-text-primary-dark [&_h4]:mt-4 [&_h4]:font-heading [&_h4]:text-lg [&_h4]:text-text-primary-dark [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      )}

      <div className="mt-10 border-t border-border pt-6">
        <Link href="/blog" className="text-sm text-accent-gold-text underline">
          ← Back to Blog
        </Link>
      </div>

      <div className="mt-12 rounded-md bg-bg-dark p-8 text-center">
        <h2 className="font-heading text-xl text-text-primary-light">
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
    </article>
  );
}
