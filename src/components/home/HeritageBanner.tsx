import { LinkButton } from "@/components/ui/Button";

export function HeritageBanner() {
  return (
    <section className="bg-bg-dark">
      <div className="mx-auto max-w-[1280px] px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="font-heading text-2xl text-text-primary-light sm:text-3xl">
          Timeless Beauty. Trusted Since 1888.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-text-muted-light sm:text-base">
          For over 135 years, Gemora has been passionate about sourcing the
          world&apos;s most exquisite gemstones and bringing their natural
          beauty to life.
        </p>
        <LinkButton href="/about" variant="outline-light" className="mt-8">
          About Our Heritage
        </LinkButton>
      </div>
    </section>
  );
}
