"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { FaqContent } from "@/types/content";

export function FaqAccordion({ faqs }: { faqs: FaqContent[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="flex flex-col">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q-${i}`;
        const panelId = `${base}-a-${i}`;
        return (
          <li
            key={f.question}
            className={cn(
              "rounded-[22px] transition-[background-color,box-shadow] duration-500",
              isOpen ? "bg-card shadow-[var(--shadow-card)]" : "rounded-none border-b border-line",
            )}
          >
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-5 px-5 py-5 text-left sm:px-6"
              >
                <span className="font-mono text-xs text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg font-medium tracking-[-0.02em] text-pine sm:text-xl">{f.question}</span>
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-pine text-lime transition-transform duration-300 ease-[var(--ease-snap)] group-hover:scale-105">
                  {isOpen ? <Minus className="size-4" strokeWidth={2.5} /> : <Plus className="size-4" strokeWidth={2.5} />}
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
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl px-5 pb-6 pl-[3.6rem] font-light leading-relaxed text-fg-2 sm:px-6 sm:pl-[4.1rem]">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
