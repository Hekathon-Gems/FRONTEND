"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateProfile, uploadPhoto } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/gif"];

export default function AccountSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(
    user?.emailNotifications ?? true,
  );
  const [smsNotifications, setSmsNotifications] = useState(
    user?.smsNotifications ?? true,
  );
  const [marketingEmails, setMarketingEmails] = useState(
    user?.marketingEmails ?? true,
  );
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  if (!user) return null;

  async function handleSaveInfo(e: FormEvent) {
    e.preventDefault();
    setSavingInfo(true);
    setInfoSaved(false);
    try {
      const updated = await updateProfile({ firstName, lastName, phone });
      setAuthenticated(updated);
      setInfoSaved(true);
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleSavePrefs(e: FormEvent) {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsSaved(false);
    try {
      const updated = await updateProfile({
        emailNotifications,
        smsNotifications,
        marketingEmails,
      });
      setAuthenticated(updated);
      setPrefsSaved(true);
    } finally {
      setSavingPrefs(false);
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return;
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError(null);

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Photo must be a JPG, PNG or GIF.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo must be 2MB or smaller.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const { profileImageUrl } = await uploadPhoto(file);
      setAuthenticated({ ...user, profileImageUrl });
    } catch (err) {
      setPhotoError(
        err instanceof Error ? err.message : "Could not upload this photo.",
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Account Settings
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Manage your account information.
      </p>

      <div className="mt-8 rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Profile Picture
        </h2>
        <div className="mt-4 flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-bg-cream">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.firstName}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-text-muted">
                <UserRound className="h-8 w-8" strokeWidth={1.25} />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? "Uploading…" : "Change Photo"}
            </Button>
            <p className="mt-2 text-xs text-text-muted">
              JPG, PNG or GIF. Max size 2MB.
            </p>
            {photoError && (
              <p className="mt-1 text-xs text-danger">{photoError}</p>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSaveInfo}
        className="mt-6 rounded-md border border-border bg-bg-white p-6"
      >
        <h2 className="font-heading text-lg text-text-primary-dark">
          Personal Information
        </h2>
        {infoSaved && (
          <p className="mt-3 rounded-md bg-success-bg px-3 py-2 text-sm text-success">
            Your changes have been saved.
          </p>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">
              First Name
            </span>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">
              Last Name
            </span>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">
              Email Address
            </span>
            <input
              disabled
              value={user.email}
              className="h-11 w-full rounded-sm border border-border bg-bg-cream px-3 text-sm text-text-muted"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">
              Phone Number
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none"
            />
          </label>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="mt-5"
          disabled={savingInfo}
        >
          Save Changes
        </Button>
      </form>

      <form
        onSubmit={handleSavePrefs}
        className="mt-6 rounded-md border border-border bg-bg-white p-6"
      >
        <h2 className="font-heading text-lg text-text-primary-dark">
          Preferences
        </h2>
        {prefsSaved && (
          <p className="mt-3 rounded-md bg-success-bg px-3 py-2 text-sm text-success">
            Your changes have been saved.
          </p>
        )}
        <div className="mt-4 space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-border accent-accent-gold"
            />
            <span>
              <span className="block text-sm font-medium text-text-primary-dark">
                Email Notifications
              </span>
              <span className="block text-xs text-text-muted">
                Receive updates about your orders and new collections.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-border accent-accent-gold"
            />
            <span>
              <span className="block text-sm font-medium text-text-primary-dark">
                SMS Notifications
              </span>
              <span className="block text-xs text-text-muted">
                Receive text messages about your orders.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-border accent-accent-gold"
            />
            <span>
              <span className="block text-sm font-medium text-text-primary-dark">
                Marketing Emails
              </span>
              <span className="block text-xs text-text-muted">
                Receive emails about promotions and offers.
              </span>
            </span>
          </label>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="mt-5"
          disabled={savingPrefs}
        >
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
