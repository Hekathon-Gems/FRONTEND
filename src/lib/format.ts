export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function stockStatusLabel(status: string): string {
  switch (status) {
    case "in_stock":
      return "In Stock — Ready to ship";
    case "low_stock":
      return "Low Stock — Only 1 left";
    case "out_of_stock":
    case "sold":
      return "Out of Stock — Notify Me";
    default:
      return status;
  }
}
