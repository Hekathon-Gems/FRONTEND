"use client";

import { useState } from "react";
import { PaymentElement, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";

export function PaymentPanel({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (!elements) return;
    setSubmitting(true);
    setError(null);
    const { error: submitError } = await elements.submit();
    setSubmitting(false);
    if (submitError) {
      setError(
        submitError.message ?? "Please check your card details and try again.",
      );
      return;
    }
    onContinue();
  }

  return (
    <div className="rounded-md border border-border bg-bg-white p-6">
      <h2 className="font-heading text-lg text-text-primary-dark">
        Payment Details
      </h2>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-5">
        <PaymentElement />
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={handleContinue}
          disabled={submitting}
        >
          Continue to Review →
        </Button>
      </div>
    </div>
  );
}
