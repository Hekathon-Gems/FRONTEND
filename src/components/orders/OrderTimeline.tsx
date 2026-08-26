import clsx from "clsx";
import { Check } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { OrderResponse } from "@/lib/types";

const STAGES: { label: string; field: keyof OrderResponse }[] = [
  { label: "Order Placed", field: "placedAt" },
  { label: "Processing", field: "processingAt" },
  { label: "Shipped", field: "shippedAt" },
  { label: "Delivered", field: "deliveredAt" },
];

export function OrderTimeline({ order }: { order: OrderResponse }) {
  if (order.status === "cancelled") {
    const note = order.statusHistory.find(
      (h) => h.status === "cancelled",
    )?.note;
    return (
      <div className="rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
        This order was cancelled
        {order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ""}.
        {note ? ` ${note}` : ""}
      </div>
    );
  }

  const lastCompletedIndex = STAGES.reduce(
    (acc, stage, index) => (order[stage.field] ? index : acc),
    -1,
  );

  return (
    <ol className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
      {STAGES.map((stage, index) => {
        const timestamp = order[stage.field] as string | null;
        const isDone = index <= lastCompletedIndex;
        return (
          <li
            key={stage.label}
            className="relative flex flex-col items-center text-center"
          >
            {index < STAGES.length - 1 && (
              <span
                className={clsx(
                  "absolute left-1/2 top-4 hidden h-px w-full sm:block",
                  index < lastCompletedIndex ? "bg-accent-gold" : "bg-border",
                )}
              />
            )}
            <span
              className={clsx(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                isDone
                  ? "bg-accent-gold text-bg-dark"
                  : "border border-border bg-bg-cream text-text-muted",
              )}
            >
              {isDone && <Check className="h-4 w-4" strokeWidth={2} />}
            </span>
            <p
              className={clsx(
                "mt-3 text-sm font-medium",
                isDone ? "text-text-primary-dark" : "text-text-muted",
              )}
            >
              {stage.label}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {timestamp ? formatDate(timestamp) : "—"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
