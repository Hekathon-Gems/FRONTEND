import clsx from "clsx";
import { Check } from "lucide-react";

const STEPS = [
  { number: 1, label: "Shipping" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Review" },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center justify-center gap-4 sm:gap-8">
      {STEPS.map((step, index) => {
        const isDone = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <li key={step.number} className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isDone && "bg-accent-gold text-bg-dark",
                  isActive && "bg-bg-dark text-text-primary-light",
                  !isDone &&
                    !isActive &&
                    "border border-border text-text-muted",
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4" strokeWidth={2} />
                ) : (
                  step.number
                )}
              </span>
              <span
                className={clsx(
                  "text-sm font-medium",
                  isActive || isDone
                    ? "text-text-primary-dark"
                    : "text-text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span className="h-px w-8 bg-border sm:w-16" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
