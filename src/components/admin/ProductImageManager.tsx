"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Gem, GripVertical, Trash2, Upload } from "lucide-react";
import {
  uploadProductImage,
  reorderProductImages,
  removeProductImage,
} from "@/lib/admin-client";
import type { AdminProduct } from "@/lib/admin-types";

export function ProductImageManager({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: AdminProduct["images"];
  onChange: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadProductImage(productId, file, "");
      onChange();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not upload this image.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove(imageId: string) {
    await removeProductImage(productId, imageId);
    onChange();
  }

  async function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    await reorderProductImages(
      productId,
      reordered.map((img) => img.id),
    );
    onChange();
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="group relative aspect-square cursor-move overflow-hidden rounded-md border border-border bg-bg-dark"
          >
            <Image
              src={image.url}
              alt={image.altText ?? ""}
              fill
              sizes="120px"
              className="object-cover"
            />
            {index === 0 && (
              <span className="absolute left-1 top-1 rounded-full bg-accent-gold px-2 py-0.5 text-[10px] font-medium text-bg-dark">
                Primary
              </span>
            )}
            <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => handleRemove(image.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-white/90 text-danger"
              >
                <Trash2 className="h-3 w-3" strokeWidth={1.5} />
              </button>
            </div>
            <div className="absolute bottom-1 left-1 text-text-primary-light opacity-0 transition-opacity group-hover:opacity-100">
              <GripVertical className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-text-muted hover:border-accent-gold hover:text-accent-gold"
        >
          {uploading ? (
            <Gem className="h-5 w-5 animate-pulse" strokeWidth={1.5} />
          ) : (
            <Upload className="h-5 w-5" strokeWidth={1.5} />
          )}
          <span className="text-xs">
            {uploading ? "Uploading…" : "Add Image"}
          </span>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="mt-2 text-xs text-text-muted">
        JPG, PNG or WebP. Max size 5MB. Drag to reorder — the first image is
        primary.
      </p>
    </div>
  );
}
