"use client";

import { useParams } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Edit Post
      </h1>
      <p className="mt-1 text-sm text-text-muted">Update this article.</p>
      <div className="mt-6">
        <BlogPostForm postId={params.id} />
      </div>
    </div>
  );
}
