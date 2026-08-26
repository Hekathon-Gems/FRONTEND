"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import {
  PasswordRulesChecklist,
  passwordPassesAllRules,
} from "@/components/ui/PasswordRulesChecklist";
import { changePassword } from "@/lib/auth-client";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passwordPassesAllRules(newPassword)) {
      setError("Please meet all password requirements below.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await changePassword(currentPassword, newPassword);
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Your current password is incorrect.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Change Password
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Update the password you use to sign in.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md rounded-md border border-border bg-bg-white p-6"
      >
        {error && (
          <p className="mb-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {saved && (
          <p className="mb-4 rounded-md bg-success-bg px-3 py-2 text-sm text-success">
            Password changed.
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            Current Password
          </span>
          <PasswordField
            id="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">
            New Password
          </span>
          <PasswordField
            id="new-password"
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
          />
          <PasswordRulesChecklist password={newPassword} />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="mt-6 w-full"
          disabled={submitting}
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}
