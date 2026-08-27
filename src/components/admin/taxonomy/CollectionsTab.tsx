"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/admin-client";
import type { AdminCollection } from "@/lib/admin-types";

const FIELD_CLASSES =
  "h-10 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none";

export function CollectionsTab() {
  const [rows, setRows] = useState<AdminCollection[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  function load() {
    getAdminCollections().then(setRows);
  }

  useEffect(load, []);

  function startEdit(row?: AdminCollection) {
    setEditingId(row?.id ?? "new");
    setName(row?.name ?? "");
    setDescription(row?.description ?? "");
    setBannerImageUrl(row?.bannerImageUrl ?? "");
    setIsActive(row?.isActive ?? true);
  }

  async function save() {
    const input = {
      name,
      description: description || undefined,
      bannerImageUrl: bannerImageUrl || undefined,
      isActive,
    };
    if (editingId === "new") await createCollection(input);
    else if (editingId) await updateCollection(editingId, input);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this collection?")) return;
    await deleteCollection(id);
    load();
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => startEdit()}>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Collection
        </Button>
      </div>

      {editingId && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-md border border-border bg-bg-cream p-4 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={FIELD_CLASSES}
          />
          <input
            value={bannerImageUrl}
            onChange={(e) => setBannerImageUrl(e.target.value)}
            placeholder="Banner image URL"
            className={FIELD_CLASSES}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={`${FIELD_CLASSES} sm:col-span-2`}
          />
          <label className="flex items-center gap-2 text-sm text-text-primary-dark">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-accent-gold"
            />
            Active
          </label>
          <div className="flex gap-2">
            <Button variant="primary" onClick={save} disabled={!name}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-text-primary-dark">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-text-muted">{row.slug}</td>
                <td className="px-4 py-3 text-text-muted">
                  {row.isActive ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="mr-3 text-accent-gold-text underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="text-danger hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
