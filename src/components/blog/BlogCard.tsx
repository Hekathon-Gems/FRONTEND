"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/types";

const MotionLink = motion.create(Link);

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <MotionLink
      href={`/blog/${post.slug}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="block overflow-hidden rounded-md bg-bg-white shadow-card transition-shadow duration-200 hover:shadow-elevated"
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
          <span className="absolute left-3 top-3 rounded-full bg-accent-gold px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-bg-dark">
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
          {post.readTimeMinutes ? ` · ${post.readTimeMinutes} min read` : ""}
        </p>
        <span className="mt-2 inline-block text-sm text-accent-gold-text underline">
          Read More →
        </span>
      </div>
    </MotionLink>
  );
}
