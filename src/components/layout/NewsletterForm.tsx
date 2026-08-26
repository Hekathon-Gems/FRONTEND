"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={
            dark
              ? "h-11 flex-1 rounded-sm border border-border-dark bg-[#1A211D] px-3 text-sm text-text-primary-light placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
              : "h-11 flex-1 rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
          }
        />
        <Button
          type="submit"
          variant="accent"
          disabled={status === "submitting"}
        >
          Subscribe
        </Button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-sm text-success">
          You&apos;re subscribed! Check your inbox to confirm.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-danger">
          That didn&apos;t work — please check your email and try again.
        </p>
      )}
    </div>
  );
}
