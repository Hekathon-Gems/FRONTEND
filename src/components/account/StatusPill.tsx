import clsx from "clsx";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Processing",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Cancelled",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-warning-bg text-warning",
  processing: "bg-warning-bg text-warning",
  shipped: "bg-info-bg text-info",
  delivered: "bg-success-bg text-success",
  cancelled: "bg-danger-bg text-danger",
  refunded: "bg-danger-bg text-danger",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        STATUS_CLASSES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
