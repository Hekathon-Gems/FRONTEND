import { Button } from "@/components/ui/Button";

export function StripeUnavailableNotice({ onBack }: { onBack: () => void }) {
  return (
    <div className="rounded-md border border-border bg-bg-white p-6">
      <h2 className="font-heading text-lg text-text-primary-dark">
        Payment Details
      </h2>
      <p className="mt-4 rounded-md bg-warning-bg px-3 py-2 text-sm text-warning">
        Payment isn&apos;t configured in this environment yet — set
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (frontend) and STRIPE_SECRET_KEY
        (backend) to a real Stripe test-mode key pair to enable checkout.
      </p>
      <Button type="button" variant="outline" className="mt-6" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}
