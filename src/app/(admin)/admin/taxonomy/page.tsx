"use client";

import { useState } from "react";
import clsx from "clsx";
import { CategoriesTab } from "@/components/admin/taxonomy/CategoriesTab";
import { GemTypesTab } from "@/components/admin/taxonomy/GemTypesTab";
import { ShapesTab } from "@/components/admin/taxonomy/ShapesTab";
import { CollectionsTab } from "@/components/admin/taxonomy/CollectionsTab";

const TABS = [
  { key: "categories", label: "Categories" },
  { key: "gem-types", label: "Gem Types" },
  { key: "shapes", label: "Shapes" },
  { key: "collections", label: "Collections" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function TaxonomyPage() {
  const [tab, setTab] = useState<TabKey>("categories");

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">Taxonomy</h1>
      <p className="mt-1 text-sm text-text-muted">
        Categories, gem types, shapes, and collections used across the catalog.
      </p>

      <div className="mt-6 flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={clsx(
              "border-b-2 px-4 py-2.5 text-sm font-medium",
              tab === t.key
                ? "border-accent-gold text-text-primary-dark"
                : "border-transparent text-text-muted hover:text-text-primary-dark",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "categories" && <CategoriesTab />}
        {tab === "gem-types" && <GemTypesTab />}
        {tab === "shapes" && <ShapesTab />}
        {tab === "collections" && <CollectionsTab />}
      </div>
    </div>
  );
}
