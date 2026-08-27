"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { forgotPassword } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(email);
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-md border border-border bg-bg-white p-8">
        <h1 className="text-center font-heading text-2xl text-text-primary-dark">
          Reset Your Password
        </h1>
        <p className="mt-1 text-center text-sm text-text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <p className="mt-6 rounded-md bg-success-bg px-3 py-2 text-center text-sm text-success">
            If an account exists for that email, we&apos;ve sent a reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-muted">
                Email Address
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
              />
            </label>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={submitting}
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-text-muted">
          <Link href="/sign-in" className="text-accent-gold-text underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
