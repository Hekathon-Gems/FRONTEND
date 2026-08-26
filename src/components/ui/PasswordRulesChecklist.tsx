import { Check, X } from "lucide-react";
import clsx from "clsx";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
];

export function PasswordRulesChecklist({ password }: { password: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.label}
            className={clsx(
              "flex items-center gap-1.5 text-xs",
              passed ? "text-success" : "text-text-muted",
            )}
          >
            {passed ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export function passwordPassesAllRules(password: string): boolean {
  return RULES.every((rule) => rule.test(password));
}
