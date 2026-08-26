import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts, getBlogCategories } from "@/lib/api";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryChips } from "@/components/blog/CategoryChips";
import { BlogSearchForm } from "@/components/blog/BlogSearchForm";
import { Pagination } from "@/components/catalog/Pagination";

export const metadata: Metadata = {
  title: "Blog | Gemora Fine Gems",
  description:
    "Stories, tips and insights from the world of gemstones and fine jewellery. Stay inspired and informed with Gemora.",
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const category = first(sp.category);
  const q = first(sp.q);
  const page = first(sp.page) ?? "1";

  const [listResponse, categories] = await Promise.all([
    getBlogPosts({ category, q, page, limit: "8" }),
    getBlogCategories(),
  ]);

  const { data: posts, meta } = listResponse;

  function buildHref(pageNumber: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  return (
    <>
      <section className="bg-bg-dark">
        <div className="mx-auto max-w-[900px] px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs text-text-muted-light">
            <Link href="/" className="hover:text-accent-gold">
              Home
            </Link>{" "}
            &gt; Blog
          </p>
          <h1 className="mx-auto mt-5 max-w-2xl font-heading text-4xl text-text-primary-light sm:text-5xl">
            Our Blog
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-text-muted-light sm:text-base">
            Stories, tips and insights from the world of gemstones and fine
            jewellery. Stay inspired and informed with Gemora.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="space-y-6">
          <BlogSearchForm />
          <CategoryChips categories={categories} />
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-base text-text-primary-dark">
              No articles match your search. Try a different keyword or browse
              all articles.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              buildHref={buildHref}
            />
          </>
        )}
      </section>
    </>
  );
}
