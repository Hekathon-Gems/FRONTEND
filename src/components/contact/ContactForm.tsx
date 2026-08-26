"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark placeholder:text-text-muted focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message, website }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md bg-success-bg px-4 py-3 text-sm text-success">
        Thanks for reaching out! We&apos;ll get back to you within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-heading text-xl text-text-primary-dark">
        Send Us a Message
      </h2>
      <p className="text-sm text-text-muted">
        Fill out the form below and we&apos;ll get back to you as soon as
        possible.
      </p>

      {status === "error" && (
        <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          Something went wrong sending your message. Please try again or email
          us directly.
        </p>
      )}

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASSES}>Your Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={FIELD_CLASSES}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASSES}>Email Address</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={FIELD_CLASSES}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASSES}>Phone Number</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={FIELD_CLASSES}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASSES}>Subject</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={FIELD_CLASSES}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASSES}>Your Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm text-text-primary-dark placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
        />
      </label>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={status === "submitting"}
      >
        Send Message
      </Button>
    </form>
  );
}
