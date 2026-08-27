import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-2xl text-text-primary-dark sm:text-3xl">
          From Our Blog
        </h2>
        <Link href="/blog" className="text-sm text-accent-gold-text underline">
          View all articles →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block overflow-hidden rounded-md bg-bg-white shadow-card"
          >
            <div className="relative aspect-[16/10] bg-bg-dark">
              {post.featuredImageUrl ? (
                <Image
                  src={post.featuredImageUrl}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted-light">
                  <BookOpen className="h-8 w-8" strokeWidth={1} />
                </div>
              )}
              {post.category?.name && (
                <span className="absolute left-3 top-3 rounded bg-bg-dark/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-primary-light">
                  {post.category.name}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-heading text-base text-text-primary-dark">
                {post.title}
              </p>
              {post.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                  {post.excerpt}
                </p>
              )}
              <p className="mt-3 text-xs text-text-muted">
                {formatDate(post.publishedAt)}
                {post.readTimeMinutes
                  ? ` · ${post.readTimeMinutes} min read`
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
