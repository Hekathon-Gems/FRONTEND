"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function BlogSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        strokeWidth={1.5}
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles..."
        className="h-11 w-full rounded-full border border-border bg-bg-white pl-10 pr-4 text-sm text-text-primary-dark placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
      />
    </form>
  );
}
