"use client";

import { useEffect, useState } from "react";
import {
  getAdminContactSubmissions,
  updateContactSubmissionStatus,
} from "@/lib/admin-client";
import { formatDate } from "@/lib/format";
import type { AdminContactSubmission } from "@/lib/admin-types";

const STATUS_CLASSES: Record<string, string> = {
  new: "bg-warning-bg text-warning",
  in_progress: "bg-accent-gold/15 text-accent-gold",
  resolved: "bg-success-bg text-success",
};

const STATUSES = ["new", "in_progress", "resolved"];

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<
    AdminContactSubmission[] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  function load() {
    getAdminContactSubmissions(statusFilter || undefined).then(setSubmissions);
  }

  useEffect(load, [statusFilter]);

  async function handleStatusChange(id: string, status: string) {
    await updateContactSubmissionStatus(id, status);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-text-primary-dark">
            Contact Submissions
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Messages sent through the contact form.
          </p>
        </div>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {(submissions ?? []).map((sub) => {
          const isOpen = openId === sub.id;
          return (
            <div
              key={sub.id}
              className="rounded-md border border-border bg-bg-white p-4"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : sub.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
              >
                <div>
                  <p className="font-medium text-text-primary-dark">
                    {sub.name}{" "}
                    <span className="font-normal text-text-muted">
                      — {sub.email}
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm text-text-muted">
                    {sub.subject ?? "(no subject)"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${STATUS_CLASSES[sub.status]}`}
                  >
                    {sub.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatDate(sub.createdAt)}
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="whitespace-pre-wrap text-sm text-text-primary-dark">
                    {sub.message}
                  </p>
                  {sub.phone && (
                    <p className="mt-2 text-sm text-text-muted">
                      Phone: {sub.phone}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={s === sub.status}
                        onClick={() => handleStatusChange(sub.id, s)}
                        className="rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-[0.05em] text-text-primary-dark hover:border-accent-gold disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Mark {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {submissions && submissions.length === 0 && (
          <p className="rounded-md border border-border bg-bg-white px-4 py-8 text-center text-text-muted">
            No submissions.
          </p>
        )}
      </div>
    </div>
  );
}
