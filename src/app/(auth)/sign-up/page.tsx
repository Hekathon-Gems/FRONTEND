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
import { SocialButtons } from "@/components/auth/SocialButtons";
import { register } from "@/lib/auth-client";
import { mergeGuestCart, cartItemCount } from "@/lib/cart-client";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    if (!passwordPassesAllRules(password)) {
      setError("Please meet all password requirements below.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { user } = await register({ firstName, lastName, email, password });
      setAuthenticated(user);
      const merged = await mergeGuestCart().catch(() => null);
      if (merged) setItemCount(cartItemCount(merged));
      router.push(searchParams.get("redirect") || "/account");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An account already exists with this email. Try signing in instead.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-bg-white p-8">
      <h1 className="text-center font-heading text-2xl text-text-primary-dark">
        Create Account
      </h1>
      <p className="mt-1 text-center text-sm text-text-muted">
        Join Gemora Fine Gems
      </p>

      {error && (
        <p className="mt-5 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">
              First Name
            </span>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">
              Last Name
            </span>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            Email Address
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Password</span>
          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Create password"
            autoComplete="new-password"
          />
          <PasswordRulesChecklist password={password} />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={submitting}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-muted">or sign up with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4">
        <SocialButtons />
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-accent-gold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Suspense
        fallback={
          <div className="h-[640px] animate-pulse rounded-md bg-border" />
        }
      >
        <SignUpForm />
      </Suspense>
    </div>
  );
}
