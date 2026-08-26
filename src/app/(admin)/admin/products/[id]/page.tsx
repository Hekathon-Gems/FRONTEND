"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Edit Product
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Update this catalog listing.
      </p>
      <div className="mt-6">
        <ProductForm productId={params.id} />
      </div>
    </div>
  );
}
