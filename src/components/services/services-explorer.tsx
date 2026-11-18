"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { ServiceGlyph } from "@/components/services/service-glyph";
import { ButtonLink } from "@/components/ui/button";
import { discussService } from "@/lib/utils/prefill";
import { pad2 } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ServiceContent } from "@/types/content";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial service index. Desktop: hover/focus a row to drive the sticky detail panel.
 * Mobile: each row expands in place.
 */
export function ServicesExplorer({ services }: { services: ServiceContent[] }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const current = services[active] ?? services[0];
  if (!current) return null;

  return (
    <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <ol className="border-t border-line">
        {services.map((s, i) => {
          const isActive = i === active;
          const isOpen = openMobile === i;
          return (
            <li key={s.slug} id={`svc-${s.slug}`} className="border-b border-line">
              <button
                type="button"
                className="group relative flex w-full items-center gap-5 py-6 text-left sm:gap-8 lg:py-7"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  setActive(i);
                  setOpenMobile(isOpen ? null : i);
                }}
                aria-expanded={isOpen}
                aria-controls={`svc-panel-${s.slug}`}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 hidden w-px origin-top bg-gradient-to-b from-accent to-accent-2 transition-transform duration-700 ease-[var(--ease-out)] lg:block",
                    isActive ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span className={cn("font-mono text-xs transition-colors lg:pl-6", isActive ? "text-accent" : "text-fg-3")}>
                  {pad2(i + 1)}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[clamp(1.35rem,2.6vw,2.3rem)] font-medium tracking-[-0.035em] transition-[color,transform] duration-500 ease-[var(--ease-out)]",
                    isActive ? "text-fg lg:translate-x-2" : "text-fg-2 group-hover:text-fg",
                  )}
                >
                  {s.title}
                </span>
                <Plus
                  aria-hidden
                  className={cn("size-5 shrink-0 text-fg-2 transition-transform duration-500 lg:hidden", isOpen && "rotate-45")}
                />
                <ArrowUpRight
                  aria-hidden
                  className={cn(
                    "hidden size-5 shrink-0 transition-all duration-500 lg:block",
                    isActive ? "translate-x-0 text-fg opacity-100" : "-translate-x-2 opacity-0",
                  )}
                />
              </button>

              {/* Mobile inline panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`svc-panel-${s.slug}`}
                    className="overflow-hidden lg:hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <div className="pb-8">
                      <ServiceDetail service={s} compact />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      {/* Desktop sticky panel */}
      <div className="relative hidden lg:block">
        <div className="sticky top-28">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card p-10">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="mb-8 flex items-start justify-between">
                  <ServiceGlyph icon={current.icon} className="size-36" />
                  <span className="font-mono text-6xl font-light text-white/10">{pad2(active + 1)}</span>
                </div>
                <ServiceDetail service={current} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ service, compact = false }: { service: ServiceContent; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {compact && <ServiceGlyph icon={service.icon} className="size-24" />}
      {!compact && <h3 className="text-2xl font-medium tracking-[-0.03em]">{service.title}</h3>}
      <p className="leading-relaxed text-fg-2">{service.description ?? service.shortDescription}</p>
      {service.technologies.length > 0 && (
        <div>
          <p className="eyebrow mb-3">Typical tools</p>
          <ul className="flex flex-wrap gap-2">
            {service.technologies.map((t) => (
              <li key={t} className="rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-xs text-fg-2">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <ButtonLink href="/#contact" onClick={(e) => discussService(service.slug) && e.preventDefault()}>
          Discuss Project
        </ButtonLink>
        <Link
          href={`/services#${service.slug}`}
          className="inline-flex items-center gap-1.5 px-3 text-sm text-fg-2 underline-offset-4 transition-colors hover:text-fg hover:underline"
        >
          Learn more <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
