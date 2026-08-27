"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-2xl text-text-primary-dark sm:text-3xl">
        Something went wrong on our end.
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        Please try again in a moment. If this keeps happening, contact us at{" "}
        <a
          href="mailto:hello@gemora.com"
          className="text-accent-gold-text underline"
        >
          hello@gemora.com
        </a>
        .
      </p>
      <Button variant="primary" className="mt-8" onClick={retry}>
        Try Again
      </Button>
    </div>
  );
}
