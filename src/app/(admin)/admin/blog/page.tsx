"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  archiveBlogPost,
  deleteBlogPost,
  getAdminBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
} from "@/lib/admin-client";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import type { AdminBlogPost, AdminBlogCategory } from "@/lib/admin-types";

const STATUS_CLASSES: Record<string, string> = {
  draft: "bg-warning-bg text-warning",
  published: "bg-success-bg text-success",
  archived: "bg-border text-text-muted",
};

export default function AdminBlogPage() {
  const role = useAuthStore((state) => state.user?.role);
  const isAdmin = role === "admin";
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [categories, setCategories] = useState<AdminBlogCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  function load() {
    getAdminBlogPosts().then(setPosts);
    getAdminBlogCategories().then(setCategories);
  }

  useEffect(load, []);

  async function handlePublish(id: string) {
    await publishBlogPost(id);
    load();
  }
  async function handleUnpublish(id: string) {
    await unpublishBlogPost(id);
    load();
  }
  async function handleArchive(id: string) {
    await archiveBlogPost(id);
    load();
  }
  async function handleDelete(id: string) {
    if (!window.confirm("Delete this post?")) return;
    await deleteBlogPost(id);
    load();
  }
  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    await createBlogCategory({ name: newCategory.trim() });
    setNewCategory("");
    load();
  }
  async function handleDeleteCategory(id: string) {
    if (!window.confirm("Delete this category?")) return;
    await deleteBlogCategory(id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">Blog</h1>
          <p className="mt-1 text-sm text-text-muted">
            Articles and categories.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-md bg-bg-dark px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-primary-light hover:bg-black"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          New Post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr
                key={post.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-medium text-text-primary-dark hover:text-accent-gold"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {post.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${STATUS_CLASSES[post.status]}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {post.author
                    ? `${post.author.firstName} ${post.author.lastName}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                </td>
                <td className="px-4 py-3 text-xs">
                  {isAdmin && post.status !== "published" && (
                    <button
                      type="button"
                      onClick={() => handlePublish(post.id)}
                      className="mr-2 text-accent-gold-text underline"
                    >
                      Publish
                    </button>
                  )}
                  {isAdmin && post.status === "published" && (
                    <button
                      type="button"
                      onClick={() => handleUnpublish(post.id)}
                      className="mr-2 text-accent-gold-text underline"
                    >
                      Unpublish
                    </button>
                  )}
                  {isAdmin && post.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() => handleArchive(post.id)}
                      className="mr-2 text-text-muted hover:underline"
                    >
                      Archive
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-danger hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {posts && posts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Blog Categories
        </h2>
        <div className="mt-3 flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="h-10 max-w-xs rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
          />
          <Button variant="outline" onClick={handleAddCategory}>
            Add
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 rounded-full bg-bg-cream px-3 py-1.5 text-xs text-text-primary-dark"
            >
              {c.name}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id)}
                  className="text-danger"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
