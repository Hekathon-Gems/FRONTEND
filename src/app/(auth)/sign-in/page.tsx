"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { login } from "@/lib/auth-client";
import { mergeGuestCart, cartItemCount } from "@/lib/cart-client";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { user } = await login(email, password);
      setAuthenticated(user);
      const merged = await mergeGuestCart().catch(() => null);
      if (merged) setItemCount(cartItemCount(merged));
      router.push(searchParams.get("redirect") || "/account");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "That email and password don't match. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-bg-white p-8">
      <h1 className="text-center font-heading text-2xl text-text-primary-dark">
        Welcome Back
      </h1>
      <p className="mt-1 text-center text-sm text-text-muted">
        Sign in to your account
      </p>

      {error && (
        <p className="mt-5 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Password</span>
          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-xs text-accent-gold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={submitting}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-muted">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4">
        <SocialButtons />
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-accent-gold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Suspense
        fallback={
          <div className="h-[520px] animate-pulse rounded-md bg-border" />
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
