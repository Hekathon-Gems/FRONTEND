"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  getAdminSettings,
  updateSettingsBlock,
  listStaffUsers,
  createStaffUser,
  updateStaffRole,
} from "@/lib/admin-client";
import type {
  AdminSettings,
  GeneralSettings,
  ShippingSettings,
  TaxSettings,
} from "@/lib/admin-types";
import type { PublicUser } from "@/lib/types";

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [general, setGeneral] = useState<GeneralSettings>({});
  const [shipping, setShipping] = useState<ShippingSettings>({});
  const [tax, setTax] = useState<TaxSettings>({});
  const [savedBlock, setSavedBlock] = useState<string | null>(null);

  const [staff, setStaff] = useState<PublicUser[] | null>(null);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "staff" as "staff" | "admin",
  });
  const [staffError, setStaffError] = useState<string | null>(null);
  const [creatingStaff, setCreatingStaff] = useState(false);

  useEffect(() => {
    getAdminSettings().then((s) => {
      setSettings(s);
      setGeneral(s.general ?? {});
      setShipping(s.shipping ?? {});
      setTax(s.tax ?? {});
    });
    loadStaff();
  }, []);

  function loadStaff() {
    listStaffUsers().then(setStaff);
  }

  async function save(blockKey: string, content: object) {
    await updateSettingsBlock(blockKey, content as Record<string, unknown>);
    setSavedBlock(blockKey);
    setTimeout(() => setSavedBlock(null), 2000);
  }

  async function handleCreateStaff(e: FormEvent) {
    e.preventDefault();
    setStaffError(null);
    setCreatingStaff(true);
    try {
      await createStaffUser(newStaff);
      setNewStaff({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "staff",
      });
      loadStaff();
    } catch (err) {
      setStaffError(
        err instanceof Error ? err.message : "Could not create user.",
      );
    } finally {
      setCreatingStaff(false);
    }
  }

  async function handleRoleChange(id: string, role: "staff" | "admin") {
    await updateStaffRole(id, role);
    loadStaff();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">Settings</h1>
      <p className="mt-1 text-sm text-text-muted">
        Store configuration and team access.
      </p>

      <div className="mt-6 space-y-6">
        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Payment
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Stripe status:{" "}
            {settings?.payment.configured ? (
              <span className="font-medium text-success">
                Configured (
                {settings.payment.mode === "live" ? "Live mode" : "Test mode"})
              </span>
            ) : (
              <span className="font-medium text-warning">
                Not configured — add STRIPE_SECRET_KEY to enable checkout.
              </span>
            )}
          </p>
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            General
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Store Name</span>
              <input
                value={general.storeName ?? ""}
                onChange={(e) =>
                  setGeneral({ ...general, storeName: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Support Email</span>
              <input
                value={general.supportEmail ?? ""}
                onChange={(e) =>
                  setGeneral({ ...general, supportEmail: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Support Phone</span>
              <input
                value={general.supportPhone ?? ""}
                onChange={(e) =>
                  setGeneral({ ...general, supportPhone: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Business Hours</span>
              <input
                value={general.businessHours ?? ""}
                onChange={(e) =>
                  setGeneral({ ...general, businessHours: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className={LABEL_CLASSES}>Showroom Address</span>
              <input
                value={general.showroomAddress ?? ""}
                onChange={(e) =>
                  setGeneral({ ...general, showroomAddress: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={() => save("general", general)}
            >
              Save
            </Button>
            {savedBlock === "general" && (
              <span className="text-sm text-success">Saved.</span>
            )}
          </div>
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Shipping
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>
                Free Shipping Threshold (cents)
              </span>
              <input
                type="number"
                value={shipping.freeShippingThresholdCents ?? ""}
                onChange={(e) =>
                  setShipping({
                    ...shipping,
                    freeShippingThresholdCents: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Flat Shipping Rate (cents)</span>
              <input
                type="number"
                value={shipping.flatShippingCents ?? ""}
                onChange={(e) =>
                  setShipping({
                    ...shipping,
                    flatShippingCents: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className={FIELD_CLASSES}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={() => save("shipping", shipping)}
            >
              Save
            </Button>
            {savedBlock === "shipping" && (
              <span className="text-sm text-success">Saved.</span>
            )}
          </div>
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">Tax</h2>
          <div className="mt-4 sm:w-64">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>
                Flat Tax Rate (e.g. 0.07 for 7%)
              </span>
              <input
                type="number"
                step="0.001"
                value={tax.flatTaxRate ?? ""}
                onChange={(e) =>
                  setTax({
                    ...tax,
                    flatTaxRate: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className={FIELD_CLASSES}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={() => save("tax", tax)}
            >
              Save
            </Button>
            {savedBlock === "tax" && (
              <span className="text-sm text-success">Saved.</span>
            )}
          </div>
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Team Access
          </h2>
          <div className="mt-4 overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {(staff ?? []).map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 text-text-primary-dark">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" || u.role === "staff" ? (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as "staff" | "admin",
                            )
                          }
                          className="h-9 rounded-sm border border-border bg-bg-white px-2 text-sm focus:border-accent-gold focus:outline-none"
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="text-text-muted">{u.role}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {staff && staff.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-text-muted"
                    >
                      No staff members yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <form
            onSubmit={handleCreateStaff}
            className="mt-6 space-y-3 border-t border-border pt-6"
          >
            <h3 className="text-sm font-medium text-text-primary-dark">
              Add Team Member
            </h3>
            {staffError && (
              <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
                {staffError}
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="First name"
                value={newStaff.firstName}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, firstName: e.target.value })
                }
                className={FIELD_CLASSES}
              />
              <input
                required
                placeholder="Last name"
                value={newStaff.lastName}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, lastName: e.target.value })
                }
                className={FIELD_CLASSES}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
                className={FIELD_CLASSES}
              />
              <input
                required
                type="password"
                placeholder="Temporary password"
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, password: e.target.value })
                }
                className={FIELD_CLASSES}
              />
              <select
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    role: e.target.value as "staff" | "admin",
                  })
                }
                className={FIELD_CLASSES}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" variant="outline" disabled={creatingStaff}>
              {creatingStaff ? "Creating…" : "Create User"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
