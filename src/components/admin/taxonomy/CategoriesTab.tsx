"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/admin-client";
import type { AdminCategory } from "@/lib/admin-types";

const FIELD_CLASSES =
  "h-10 w-full rounded-sm border border-border bg-bg-white px-3 text-sm focus:border-accent-gold focus:outline-none";

export function CategoriesTab() {
  const [rows, setRows] = useState<AdminCategory[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  function load() {
    getAdminCategories().then(setRows);
  }

  useEffect(load, []);

  function startEdit(row?: AdminCategory) {
    setEditingId(row?.id ?? "new");
    setName(row?.name ?? "");
    setDescription(row?.description ?? "");
    setSortOrder(row?.sortOrder ?? 0);
  }

  async function save() {
    const input = { name, description: description || undefined, sortOrder };
    if (editingId === "new") await createCategory(input);
    else if (editingId) await updateCategory(editingId, input);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
    load();
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => startEdit()}>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Category
        </Button>
      </div>

      {editingId && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-md border border-border bg-bg-cream p-4 sm:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={FIELD_CLASSES}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={FIELD_CLASSES}
          />
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="Sort Order"
            className={FIELD_CLASSES}
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
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Sort</th>
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
                  {row.description ?? "—"}
                </td>
                <td className="px-4 py-3 text-text-muted">{row.sortOrder}</td>
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
