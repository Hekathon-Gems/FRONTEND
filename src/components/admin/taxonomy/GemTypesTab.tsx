"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminGemTypes,
  createGemType,
  updateGemType,
  deleteGemType,
} from "@/lib/admin-client";
import type { AdminGemType } from "@/lib/admin-types";

const FIELD_CLASSES =
  "h-10 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none";
const TEXTAREA_CLASSES =
  "w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm focus:border-accent-gold focus:outline-none";

export function GemTypesTab() {
  const [rows, setRows] = useState<AdminGemType[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [careText, setCareText] = useState("");

  function load() {
    getAdminGemTypes().then(setRows);
  }

  useEffect(load, []);

  function startEdit(row?: AdminGemType) {
    setEditingId(row?.id ?? "new");
    setName(row?.name ?? "");
    setAboutText(row?.aboutText ?? "");
    setCareText(row?.careText ?? "");
  }

  async function save() {
    const input = {
      name,
      aboutText: aboutText || undefined,
      careText: careText || undefined,
    };
    if (editingId === "new") await createGemType(input);
    else if (editingId) await updateGemType(editingId, input);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this gem type?")) return;
    await deleteGemType(id);
    load();
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => startEdit()}>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Gem Type
        </Button>
      </div>

      {editingId && (
        <div className="mt-4 space-y-3 rounded-md border border-border bg-bg-cream p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={FIELD_CLASSES}
          />
          <textarea
            rows={2}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="About text (default PDP accordion content)"
            className={TEXTAREA_CLASSES}
          />
          <textarea
            rows={2}
            value={careText}
            onChange={(e) => setCareText(e.target.value)}
            placeholder="Care & cleaning text"
            className={TEXTAREA_CLASSES}
          />
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
              <th className="px-4 py-3 font-medium">About Text</th>
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
                <td className="max-w-xs truncate px-4 py-3 text-text-muted">
                  {row.aboutText ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="mr-3 text-accent-gold hover:underline"
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
