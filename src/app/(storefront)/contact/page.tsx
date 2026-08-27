import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  UserCheck,
  ShieldCheck,
  Lock,
  Globe,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export const metadata: Metadata = {
  title: "Contact Us | Gemora Fine Gems",
  description:
    "Have a question, need expert advice, or looking for something truly unique? Get in touch with the Gemora Fine Gems team.",
};

const FEATURES = [
  {
    icon: UserCheck,
    title: "Expert Guidance",
    body: "Our gem experts are here to help you choose the perfect gem",
  },
  {
    icon: ShieldCheck,
    title: "Certified Authenticity",
    body: "All gemstones come with certificates of authenticity",
  },
  {
    icon: Lock,
    title: "Secure & Trusted",
    body: "Your information and purchases are always safe with us",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    body: "We deliver our finest gems across the globe",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-bg-dark">
        <div className="mx-auto max-w-[900px] px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs text-text-muted-light">
            <Link href="/" className="hover:text-accent-gold">
              Home
            </Link>{" "}
            &gt; Contact Us
          </p>
          <h1 className="mx-auto mt-5 max-w-2xl font-heading text-4xl text-text-primary-light sm:text-5xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-text-muted-light sm:text-base">
            Have a question, need expert advice, or looking for something truly
            unique? Our team is here to help you on your gemstone journey.
          </p>
          <LinkButton href="#contact-form" variant="accent" className="mt-8">
            Get In Touch
          </LinkButton>
        </div>
      </section>

      <section
        id="contact-form"
        className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-bg-white p-6 sm:p-8">
            <ContactForm />
          </div>

          <div>
            <h2 className="font-heading text-xl text-text-primary-dark">
              Contact Information
            </h2>
            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary-dark">
                    Visit Our Showroom
                  </p>
                  <p className="text-sm text-text-muted">
                    123 Gem Street, New York, NY 10001, USA
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary-dark">
                    Call Us
                  </p>
                  <p className="text-sm text-text-muted">+1 (800) 123 4567</p>
                  <p className="text-xs text-text-muted">
                    Mon–Fri: 9:00 AM–6:00 PM (EST)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary-dark">
                    Email Us
                  </p>
                  <p className="text-sm text-text-muted">hello@gemora.com</p>
                  <p className="text-xs text-text-muted">
                    We reply within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary-dark">
                    Business Hours
                  </p>
                  <p className="text-sm text-text-muted">
                    Monday–Saturday: 9:00 AM–6:00 PM
                  </p>
                  <p className="text-sm text-text-muted">Sunday: Closed</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary-dark">
                  Follow Us
                </p>
                <div className="mt-2 flex gap-4 text-sm text-accent-gold-text">
                  <a
                    href="https://instagram.com/gemora_gems"
                    className="underline"
                  >
                    Instagram
                  </a>
                  <a href="#" className="underline">
                    Facebook
                  </a>
                  <a href="#" className="underline">
                    Pinterest
                  </a>
                  <a href="#" className="underline">
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <MapEmbed />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center sm:text-left">
              <Icon
                className="mx-auto h-6 w-6 text-accent-gold sm:mx-0"
                strokeWidth={1.5}
              />
              <p className="mt-3 font-heading text-base text-text-primary-dark">
                {title}
              </p>
              <p className="mt-1 text-sm text-text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-2xl text-text-primary-dark">
          Stay Connected
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
          Subscribe to our newsletter for the latest collections, gemstone
          insights, and exclusive offers.
        </p>
        <div className="mt-6 flex justify-center">
          <NewsletterForm dark={false} />
        </div>
      </section>
    </>
  );
}
