"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  createBlogPost,
  updateBlogPost,
  getAdminBlogPost,
  getAdminBlogCategories,
  publishBlogPost,
} from "@/lib/admin-client";
import { useAuthStore } from "@/store/auth-store";
import type { AdminBlogCategory, BlogPostInput } from "@/lib/admin-types";

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

export function BlogPostForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const [categories, setCategories] = useState<AdminBlogCategory[]>([]);
  const [values, setValues] = useState<BlogPostInput>({
    title: "",
    blogCategoryId: "",
    excerpt: "",
    body: "",
    featuredImageUrl: "",
    readTimeMinutes: undefined,
  });
  const [status, setStatus] = useState<string>("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAdminBlogCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!postId) return;
    getAdminBlogPost(postId).then((post) => {
      setStatus(post.status);
      setValues({
        title: post.title,
        slug: post.slug,
        blogCategoryId: post.blogCategoryId ?? "",
        excerpt: post.excerpt ?? "",
        body: post.bodyHtml ?? "",
        featuredImageUrl: post.featuredImageUrl ?? "",
        readTimeMinutes: post.readTimeMinutes ?? undefined,
      });
    });
  }, [postId]);

  function set<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      if (postId) {
        await updateBlogPost(postId, values);
        setSaved(true);
      } else {
        const created = await createBlogPost(values);
        router.push(`/admin/blog/${created.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save this post.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!postId) return;
    await publishBlogPost(postId);
    setStatus("published");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-md bg-success-bg px-3 py-2 text-sm text-success">
          Changes saved.
        </p>
      )}

      <div className="rounded-md border border-border bg-bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Post Details
          </h2>
          {postId && (
            <span className="rounded-full bg-bg-cream px-3 py-1 text-xs uppercase tracking-[0.05em] text-text-muted">
              {status}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Title*</span>
            <input
              required
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Slug (auto-generated if left blank)
            </span>
            <input
              value={values.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Category*</span>
            <select
              required
              value={values.blogCategoryId}
              onChange={(e) => set("blogCategoryId", e.target.value)}
              className={FIELD_CLASSES}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Featured Image URL</span>
            <input
              value={values.featuredImageUrl ?? ""}
              onChange={(e) => set("featuredImageUrl", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Excerpt (~160 chars, used on cards)
            </span>
            <textarea
              rows={2}
              value={values.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value)}
              className="w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Body (HTML — p, h2-h4, strong, em, ul/ol/li, a, img, blockquote)
            </span>
            <textarea
              required
              rows={12}
              value={values.body}
              onChange={(e) => set("body", e.target.value)}
              className="w-full rounded-sm border border-border bg-bg-white px-3 py-2 font-mono text-xs focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:w-48">
            <span className={LABEL_CLASSES}>
              Read Time (minutes, auto-estimated if left blank)
            </span>
            <input
              type="number"
              min={1}
              value={values.readTimeMinutes ?? ""}
              onChange={(e) =>
                set(
                  "readTimeMinutes",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className={FIELD_CLASSES}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {postId ? "Save Draft" : "Create Draft"}
        </Button>
        {postId && role === "admin" && status !== "published" && (
          <Button type="button" variant="outline" onClick={handlePublish}>
            Publish
          </Button>
        )}
      </div>
    </form>
  );
}
