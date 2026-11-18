"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { FaqContent } from "@/types/content";

export function FaqAccordion({ faqs }: { faqs: FaqContent[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="border-t border-line">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q-${i}`;
        const panelId = `${base}-a-${i}`;
        return (
          <li key={f.question} className="border-b border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-6 py-6 text-left"
              >
                <span className="font-mono text-xs text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("flex-1 text-lg font-medium tracking-[-0.02em] transition-colors sm:text-xl", isOpen ? "text-fg" : "text-fg-2 group-hover:text-fg")}>
                  {f.question}
                </span>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out)]",
                    isOpen ? "rotate-45 border-fg bg-fg text-bg" : "border-line-strong",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pl-12 leading-relaxed text-fg-2">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
