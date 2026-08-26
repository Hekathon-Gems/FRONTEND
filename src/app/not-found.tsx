import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
        404
      </p>
      <h1 className="mt-4 font-heading text-2xl text-text-primary-dark sm:text-3xl">
        This page has slipped through our fingers.
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <LinkButton href="/" variant="primary" className="mt-8">
        Back to Home
      </LinkButton>
    </div>
  );
}
