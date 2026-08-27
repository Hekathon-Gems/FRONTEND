"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getAdminNewsletterSubscribers,
  downloadNewsletterCsv,
} from "@/lib/admin-client";
import { formatDate } from "@/lib/format";
import type { AdminNewsletterSubscriber } from "@/lib/admin-types";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<
    AdminNewsletterSubscriber[] | null
  >(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getAdminNewsletterSubscribers().then(setSubscribers);
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await downloadNewsletterCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "newsletter-subscribers.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const activeCount = (subscribers ?? []).filter(
    (s) => !s.unsubscribedAt,
  ).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            Newsletter Subscribers
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {subscribers
              ? `${activeCount} active of ${subscribers.length} total.`
              : "Loading…"}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {(subscribers ?? []).map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 text-text-primary-dark">
                  {sub.email}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {sub.source ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {sub.unsubscribedAt ? (
                    <span className="rounded-full bg-border px-2.5 py-1 text-xs text-text-primary-dark">
                      Unsubscribed
                    </span>
                  ) : sub.confirmedAt ? (
                    <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs text-success">
                      Confirmed
                    </span>
                  ) : (
                    <span className="rounded-full bg-warning-bg px-2.5 py-1 text-xs text-warning">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {formatDate(sub.createdAt)}
                </td>
              </tr>
            ))}
            {subscribers && subscribers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
