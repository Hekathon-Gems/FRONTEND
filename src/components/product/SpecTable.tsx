import type { Product } from "@/lib/types";

function formatCarat(carat: number | null): string | null {
  return carat != null ? `${carat} ct` : null;
}

export function SpecTable({ product }: { product: Product }) {
  const rows: { label: string; value: string | null }[] = [
    { label: "Gemstone", value: product.gemType?.name ?? null },
    { label: "Shape", value: product.shape?.name ?? null },
    { label: "Carat Weight", value: formatCarat(product.caratWeight) },
    {
      label: "Dimensions",
      value: product.dimensionsMm ? `${product.dimensionsMm} mm` : null,
    },
    { label: "Color", value: product.color },
    { label: "Clarity", value: product.clarity },
    { label: "Origin", value: product.originCountry },
    { label: "Treatment", value: product.treatment },
    { label: "Certification", value: product.certificationBody },
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <dl className="divide-y divide-border border-y border-border">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between py-3 text-sm">
          <dt className="text-text-muted">{row.label}</dt>
          <dd className="font-medium text-text-primary-dark">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
