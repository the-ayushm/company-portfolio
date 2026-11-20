"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { TestimonialContent } from "@/types/content";

const avatarTints = ["bg-sage", "bg-lilac", "bg-apricot"];

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
      className="relative mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="card relative overflow-hidden">
        <Quote aria-hidden className="pointer-events-none absolute right-8 top-8 size-16 rotate-180 fill-pine text-pine sm:right-12 sm:top-10 sm:size-24" strokeWidth={1} />
        <div className="relative min-h-[380px] p-8 sm:min-h-[340px] sm:p-14">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: reduce ? 0 : dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : dir * -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-[#CC8B5C]/60 bg-apricot/25 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-pine">
                  Sample — not a real review
                </span>
              )}
              <blockquote className={cn("max-w-4xl pr-16 text-[clamp(1.3rem,2.4vw,2rem)] font-light leading-[1.35] tracking-[-0.02em] text-pine", t.isPlaceholder && "text-fg-2")}>
                {t.review}
              </blockquote>
              <figcaption className="mt-auto flex flex-wrap items-center gap-4">
                <span className={cn("relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[16px] font-medium text-pine", avatarTints[index % avatarTints.length])}>
                  {t.avatarUrl ? <Image src={t.avatarUrl} alt="" fill sizes="56px" className="object-cover" /> : initials(t.clientName)}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-medium text-pine">{t.clientName}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.06em] text-fg-3">
                    {[t.designation, t.company].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {t.projectName && <span className="chip ml-auto">Project: {t.projectName}</span>}
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
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line-strong">
                  <span
                    className={cn("block h-full origin-left rounded-full bg-pine", i === index ? "scale-x-100" : "scale-x-0")}
                    style={i === index && !paused && !reduce ? { animation: "progress 7s linear" } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid size-12 place-items-center rounded-full border-[1.5px] border-pine text-pine transition-colors hover:bg-pine hover:text-porcelain">
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid size-12 place-items-center rounded-full bg-pine text-porcelain transition-colors hover:bg-pine-2">
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
