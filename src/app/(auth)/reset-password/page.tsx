"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import {
  PasswordRulesChecklist,
  passwordPassesAllRules,
} from "@/components/ui/PasswordRulesChecklist";
import { resetPassword } from "@/lib/auth-client";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passwordPassesAllRules(password)) {
      setError("Please meet all password requirements below.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "This reset link is invalid or has expired.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <p className="rounded-md bg-danger-bg px-3 py-2 text-center text-sm text-danger">
        This reset link is invalid or has expired.
      </p>
    );
  }

  if (done) {
    return (
      <p className="rounded-md bg-success-bg px-3 py-2 text-center text-sm text-success">
        Password updated. Redirecting you to sign in…
      </p>
    );
  }

  return (
    <div className="rounded-md border border-border bg-bg-white p-8">
      <h1 className="text-center font-heading text-2xl text-text-primary-dark">
        Set a New Password
      </h1>

      {error && (
        <p className="mt-5 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            New Password
          </span>
          <PasswordField
            id="new-password"
            value={password}
            onChange={setPassword}
            placeholder="Create a new password"
            autoComplete="new-password"
          />
          <PasswordRulesChecklist password={password} />
        </label>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={submitting}
        >
          Update Password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link href="/sign-in" className="text-accent-gold-text underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Suspense
        fallback={
          <div className="h-[420px] animate-pulse rounded-md bg-border" />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
