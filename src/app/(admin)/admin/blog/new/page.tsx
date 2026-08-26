import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">New Post</h1>
      <p className="mt-1 text-sm text-text-muted">
        Create a new draft article.
      </p>
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
