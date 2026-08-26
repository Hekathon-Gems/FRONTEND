"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

export function Accordion({
  items,
  defaultOpenIndex = 0,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="font-heading text-base text-text-primary-dark">
                {item.title}
              </span>
              <ChevronDown
                className={clsx(
                  "h-4 w-4 text-text-muted transition-transform duration-200 ease-in-out",
                  isOpen && "rotate-180",
                )}
                strokeWidth={1.5}
              />
            </button>
            <div
              className={clsx(
                "grid overflow-hidden transition-all duration-200 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] pb-4 opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0 text-sm leading-relaxed text-text-muted">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
