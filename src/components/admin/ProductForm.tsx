"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProductImageManager } from "./ProductImageManager";
import { RelatedProductsPicker } from "./RelatedProductsPicker";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  getAdminGemTypes,
  getAdminShapes,
  getAdminCollections,
  getAdminProduct,
} from "@/lib/admin-client";
import type {
  AdminCategory,
  AdminCollection,
  AdminGemType,
  AdminShape,
  ProductInput,
} from "@/lib/admin-types";

const PRODUCT_TYPES = ["loose_gem", "ring", "pendant", "earring", "bracelet"];
const STOCK_STATUSES = ["in_stock", "low_stock", "out_of_stock", "sold"];

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";

interface FormState extends ProductInput {
  relatedProductNames: { id: string; name: string }[];
}

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [gemTypes, setGemTypes] = useState<AdminGemType[]>([]);
  const [shapes, setShapes] = useState<AdminShape[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [images, setImages] = useState<
    {
      id: string;
      url: string;
      mediaType: string;
      altText: string | null;
      sortOrder: number;
    }[]
  >([]);
  const [values, setValues] = useState<FormState>({
    name: "",
    sku: "",
    categoryId: "",
    gemTypeId: "",
    price: 0,
    isUnique: true,
    stockQuantity: 1,
    isFeatured: false,
    isActive: false,
    collectionIds: [],
    relatedProductIds: [],
    relatedProductNames: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAdminCategories().then(setCategories);
    getAdminGemTypes().then(setGemTypes);
    getAdminShapes().then(setShapes);
    getAdminCollections().then(setCollections);
  }, []);

  function loadProduct() {
    if (!productId) return;
    getAdminProduct(productId).then((product) => {
      Promise.all(
        product.relatedProductIds.map((id) =>
          getAdminProduct(id)
            .then((p) => ({ id, name: p.name }))
            .catch(() => ({ id, name: id })),
        ),
      ).then((relatedProductNames) => {
        setImages(product.images);
        setValues({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          productType: product.productType,
          categoryId: product.category?.id ?? "",
          gemTypeId: product.gemType?.id ?? "",
          shapeId: product.shape?.id ?? undefined,
          shortDescription: product.shortDescription ?? undefined,
          longDescription: product.longDescription ?? undefined,
          price: product.price,
          caratWeight: product.caratWeight ?? undefined,
          dimensionsMm: product.dimensionsMm ?? undefined,
          color: product.color ?? undefined,
          clarity: product.clarity ?? undefined,
          originCountry: product.originCountry ?? undefined,
          treatment: product.treatment ?? undefined,
          certificationBody: product.certificationBody ?? undefined,
          certificationInfoUrl: product.certificationInfoUrl ?? undefined,
          isUnique: product.isUnique,
          stockQuantity: product.stockQuantity,
          stockStatus: product.stockStatus,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          collectionIds: product.collectionIds,
          relatedProductIds: product.relatedProductIds,
          relatedProductNames,
        });
      });
    });
  }

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    const { relatedProductNames: _relatedProductNames, ...input } = values;
    void _relatedProductNames;
    try {
      if (productId) {
        await updateProduct(productId, input);
        setSaved(true);
        loadProduct();
      } else {
        const created = await createProduct(input);
        router.push(`/admin/products/${created.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save this product.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!productId) return;
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    await deleteProduct(productId);
    router.push("/admin/products");
  }

  function toggleCollection(id: string) {
    const current = values.collectionIds ?? [];
    set(
      "collectionIds",
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-md bg-success-bg px-3 py-2 text-sm text-success">
          Changes saved.
        </p>
      )}

      <section className="rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Basic Information
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={LABEL_CLASSES}>Name*</span>
            <input
              required
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>SKU*</span>
            <input
              required
              value={values.sku}
              onChange={(e) => set("sku", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Slug (auto-generated if left blank)
            </span>
            <input
              value={values.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Product Type</span>
            <select
              value={values.productType ?? "loose_gem"}
              onChange={(e) => set("productType", e.target.value)}
              className={FIELD_CLASSES}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Category*</span>
            <select
              required
              value={values.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={FIELD_CLASSES}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Gem Type*</span>
            <select
              required
              value={values.gemTypeId}
              onChange={(e) => set("gemTypeId", e.target.value)}
              className={FIELD_CLASSES}
            >
              <option value="">Select…</option>
              {gemTypes.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Shape</span>
            <select
              value={values.shapeId ?? ""}
              onChange={(e) => set("shapeId", e.target.value || undefined)}
              className={FIELD_CLASSES}
            >
              <option value="">None</option>
              {shapes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Pricing &amp; Stock
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Price (USD)*</span>
            <input
              required
              type="number"
              min={0.01}
              step={0.01}
              value={values.price ? values.price / 100 : ""}
              onChange={(e) =>
                set("price", Math.round(Number(e.target.value) * 100))
              }
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Stock Quantity</span>
            <input
              type="number"
              min={0}
              value={values.stockQuantity ?? 1}
              onChange={(e) => set("stockQuantity", Number(e.target.value))}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Stock Status (auto-derived, overridable)
            </span>
            <select
              value={values.stockStatus ?? ""}
              onChange={(e) => set("stockStatus", e.target.value || undefined)}
              className={FIELD_CLASSES}
            >
              <option value="">Auto</option>
              {STOCK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-sm text-text-primary-dark">
              <input
                type="checkbox"
                checked={values.isUnique ?? true}
                onChange={(e) => set("isUnique", e.target.checked)}
                className="h-4 w-4 accent-accent-gold"
              />
              Is Unique
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary-dark">
              <input
                type="checkbox"
                checked={values.isFeatured ?? false}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="h-4 w-4 accent-accent-gold"
              />
              Is Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary-dark">
              <input
                type="checkbox"
                checked={values.isActive ?? false}
                onChange={(e) => set("isActive", e.target.checked)}
                className="h-4 w-4 accent-accent-gold"
              />
              Active (requires at least one image)
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Gemological Details
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Carat Weight</span>
            <input
              type="number"
              step={0.01}
              value={values.caratWeight ?? ""}
              onChange={(e) =>
                set(
                  "caratWeight",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Dimensions (mm)</span>
            <input
              value={values.dimensionsMm ?? ""}
              onChange={(e) => set("dimensionsMm", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Color</span>
            <input
              value={values.color ?? ""}
              onChange={(e) => set("color", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Clarity</span>
            <input
              value={values.clarity ?? ""}
              onChange={(e) => set("clarity", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Origin Country</span>
            <input
              value={values.originCountry ?? ""}
              onChange={(e) => set("originCountry", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Treatment</span>
            <input
              value={values.treatment ?? ""}
              onChange={(e) => set("treatment", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Certification Body</span>
            <input
              value={values.certificationBody ?? ""}
              onChange={(e) => set("certificationBody", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={LABEL_CLASSES}>Certification Info URL</span>
            <input
              value={values.certificationInfoUrl ?? ""}
              onChange={(e) => set("certificationInfoUrl", e.target.value)}
              className={FIELD_CLASSES}
            />
          </label>
        </div>
      </section>

      <section className="rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Descriptions
        </h2>
        <div className="mt-4 space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>
              Short Description (used on cards)
            </span>
            <textarea
              rows={2}
              value={values.shortDescription ?? ""}
              onChange={(e) => set("shortDescription", e.target.value)}
              className="w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm focus:border-accent-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Long Description</span>
            <textarea
              rows={5}
              value={values.longDescription ?? ""}
              onChange={(e) => set("longDescription", e.target.value)}
              className="w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm focus:border-accent-gold focus:outline-none"
            />
          </label>
        </div>
      </section>

      {productId ? (
        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">Media</h2>
          <div className="mt-4">
            <ProductImageManager
              productId={productId}
              images={images}
              onChange={loadProduct}
            />
          </div>
        </section>
      ) : (
        <section className="rounded-md border border-dashed border-border bg-bg-cream p-6 text-sm text-text-muted">
          Save this product first to upload images and set related products.
        </section>
      )}

      <section className="rounded-md border border-border bg-bg-white p-6">
        <h2 className="font-heading text-lg text-text-primary-dark">
          Collections
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {collections.map((collection) => (
            <label
              key={collection.id}
              className="flex items-center gap-2 text-sm text-text-primary-dark"
            >
              <input
                type="checkbox"
                checked={(values.collectionIds ?? []).includes(collection.id)}
                onChange={() => toggleCollection(collection.id)}
                className="h-4 w-4 accent-accent-gold"
              />
              {collection.name}
            </label>
          ))}
          {collections.length === 0 && (
            <p className="text-sm text-text-muted">No collections yet.</p>
          )}
        </div>
      </section>

      {productId && (
        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Related Products
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Falls back to same-gem-type suggestions if left empty.
          </p>
          <div className="mt-4">
            <RelatedProductsPicker
              excludeId={productId}
              selected={values.relatedProductNames}
              onChange={(next) => {
                set("relatedProductNames", next);
                set(
                  "relatedProductIds",
                  next.map((n) => n.id),
                );
              }}
            />
          </div>
        </section>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {productId ? "Save Changes" : "Create Product"}
        </Button>
        {productId && (
          <Button
            type="button"
            variant="outline"
            className="border-danger text-danger"
            onClick={handleDelete}
          >
            Delete Product
          </Button>
        )}
      </div>
    </form>
  );
}
