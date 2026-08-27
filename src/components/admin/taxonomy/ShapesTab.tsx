"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminShapes,
  createShape,
  updateShape,
  deleteShape,
} from "@/lib/admin-client";
import type { AdminShape } from "@/lib/admin-types";

const FIELD_CLASSES =
  "h-10 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none";

export function ShapesTab() {
  const [rows, setRows] = useState<AdminShape[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");

  function load() {
    getAdminShapes().then(setRows);
  }

  useEffect(load, []);

  function startEdit(row?: AdminShape) {
    setEditingId(row?.id ?? "new");
    setName(row?.name ?? "");
  }

  async function save() {
    if (editingId === "new") await createShape({ name });
    else if (editingId) await updateShape(editingId, { name });
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this shape?")) return;
    await deleteShape(id);
    load();
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => startEdit()}>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Shape
        </Button>
      </div>

      {editingId && (
        <div className="mt-4 flex gap-3 rounded-md border border-border bg-bg-cream p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={FIELD_CLASSES}
          />
          <Button variant="primary" onClick={save} disabled={!name}>
            Save
          </Button>
          <Button variant="outline" onClick={() => setEditingId(null)}>
            Cancel
          </Button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.05em] text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
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
