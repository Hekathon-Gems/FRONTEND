import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Add Product
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Create a new catalog listing.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
