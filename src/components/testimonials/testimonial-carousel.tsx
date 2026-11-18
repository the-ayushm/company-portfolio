"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { TestimonialContent } from "@/types/content";

export function TestimonialCarousel({ items }: { items: TestimonialContent[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const count = items.length;

  const go = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + count) % count, delta]),
    [count],
  );

  useEffect(() => {
    if (paused || reduce || count < 2) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, reduce, count, go]);

  const t = items[index];
  if (!t) return null;

  return (
    <div
      className="relative mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card">
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl" />
        <Quote aria-hidden className="absolute right-8 top-8 size-20 text-white/[0.04] sm:size-28" />

        <div className="relative min-h-[380px] p-8 sm:min-h-[340px] sm:p-14">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: reduce ? 0 : dir * 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: reduce ? 0 : dir * -60, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
              className="flex h-full cursor-grab flex-col gap-10 active:cursor-grabbing"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              {t.isPlaceholder && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-warning/40 bg-warning/[0.06] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-warning/90">
                  Sample — not a real review
                </span>
              )}
              <blockquote className={cn("max-w-4xl text-[clamp(1.35rem,2.6vw,2.2rem)] leading-[1.3] tracking-[-0.02em]", t.isPlaceholder && "text-fg-2")}>
                “{t.review}”
              </blockquote>
              <figcaption className="mt-auto flex flex-wrap items-center gap-4">
                <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-line-strong bg-card-2 font-medium">
                  {t.avatarUrl ? (
                    <Image src={t.avatarUrl} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    initials(t.clientName)
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="font-medium">{t.clientName}</span>
                  <span className="text-sm text-fg-2">
                    {[t.designation, t.company].filter(Boolean).join(", ")}
                  </span>
                </span>
                {t.projectName && (
                  <span className="ml-auto rounded-full border border-line px-3 py-1.5 text-xs text-fg-2">
                    Project: {t.projectName}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className="group relative h-6 w-10"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden bg-line-strong">
                  <span
                    className={cn("block h-full origin-left bg-fg", i === index ? "scale-x-100" : "scale-x-0")}
                    style={i === index && !paused && !reduce ? { animation: "progress 7s linear" } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors hover:border-fg/40 hover:bg-white/[0.04]">
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors hover:border-fg/40 hover:bg-white/[0.04]">
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </div>
  );
}
