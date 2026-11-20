"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { ServiceGlyph } from "@/components/services/service-glyph";
import { ButtonLink } from "@/components/ui/button";
import { PanelStatus } from "@/components/ui/note-pill";
import { serviceLook } from "@/config/blocks";
import { discussService } from "@/lib/utils/prefill";
import { SERVICE_SELECT_EVENT } from "@/lib/utils/service-select";
import { pad2 } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ServiceContent } from "@/types/content";

const ServiceBlockScene = dynamic(() => import("@/components/three/service-block-scene"), { ssr: false, loading: () => null });

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Service index. Desktop: hovering/focusing a row drives the pine panel, whose single 3D block
 * re-colours and relabels itself for that service. Mobile: rows expand in place.
 */
export function ServicesExplorer({ services }: { services: ServiceContent[] }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const current = services[active] ?? services[0];

  // Selected from elsewhere (e.g. clicking a block in the hero).
  useEffect(() => {
    const onSelect = (e: Event) => {
      const i = services.findIndex((s) => s.slug === (e as CustomEvent<string>).detail);
      if (i < 0) return;
      setActive(i);
      setOpenMobile(i);
    };
    window.addEventListener(SERVICE_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(SERVICE_SELECT_EVENT, onSelect);
  }, [services]);

  if (!current) return null;

  return (
    <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
      <ol className="flex flex-col gap-1.5">
        {services.map((s, i) => {
          const isActive = i === active;
          const isOpen = openMobile === i;
          return (
            <li key={s.slug} id={`svc-${s.slug}`} className={cn("rounded-[22px] transition-[background-color,box-shadow] duration-500", isActive ? "lg:bg-card lg:shadow-[var(--shadow-card)]" : "", isOpen && "max-lg:bg-card max-lg:shadow-[var(--shadow-card)]")}>
              <button
                type="button"
                className="group flex w-full items-center gap-4 px-4 py-4 text-left sm:gap-5 sm:px-5"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  setActive(i);
                  setOpenMobile(isOpen ? null : i);
                }}
                aria-expanded={isOpen}
                aria-controls={`svc-panel-${s.slug}`}
              >
                <span className="w-6 font-mono text-xs text-fg-3">{pad2(i + 1)}</span>
                <ServiceGlyph icon={s.icon} size={22} label={false} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium tracking-[-0.03em] text-pine">{s.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-fg-2 max-sm:hidden">{s.shortDescription}</span>
                </span>
                <Plus aria-hidden className={cn("size-5 shrink-0 text-pine transition-transform duration-500 lg:hidden", isOpen && "rotate-45")} />
                <span
                  aria-hidden
                  className={cn(
                    "hidden size-8 shrink-0 place-items-center rounded-full bg-lime text-pine transition-all duration-500 lg:grid",
                    isActive ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  )}
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </button>

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
                    <div className="px-4 pb-6 sm:px-5">
                      <ServiceDetail service={s} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      <div className="relative hidden lg:block">
        <div className="sticky top-28">
          <ServicePanel service={current} index={active} total={services.length} />
        </div>
      </div>
    </div>
  );
}

function ServicePanel({ service, index, total }: { service: ServiceContent; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [gl, setGl] = useState(true);
  const look = serviceLook(service.icon);
  const blockLook = useMemo(() => ({ color: look.color, title: look.short, label: `${pad2(index + 1)} · SERVICE`, index }), [look.color, look.short, index]);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL detection is browser-only
      setGl(Boolean(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setGl(false);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setNear(true);
        setInView(Boolean(e?.isIntersecting));
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="pine-panel on-pine flex min-h-[620px] flex-col">
      <div className="flex items-center justify-between px-8 pt-7">
        <PanelStatus label={`Service ${pad2(index + 1)} / ${pad2(total)}`} value="selected" />
      </div>
      <div className="relative h-[300px]">
        {near && gl ? (
          <ServiceBlockScene look={blockLook} active={inView} reduced={reduce} />
        ) : (
          <div className="grid h-full place-items-center">
            <ServiceGlyph icon={service.icon} size={150} />
          </div>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={service.slug}
          className="mt-auto px-8 pb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease }}
        >
          <h3 className="h-card text-porcelain">{service.title}</h3>
          <ServiceDetail service={service} dark />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ServiceDetail({ service, dark = false }: { service: ServiceContent; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <p className={cn("mt-3 font-light leading-relaxed", dark ? "text-porcelain/75" : "text-fg-2")}>{service.description ?? service.shortDescription}</p>
      {service.technologies.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Typical tools">
          {service.technologies.map((t) => (
            <li key={t} className={cn("chip", dark && "bg-porcelain/10 text-porcelain")}>
              {t}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <ButtonLink href="/#contact" variant={dark ? "lime" : "primary"} onClick={(e) => discussService(service.slug) && e.preventDefault()}>
          Discuss this
        </ButtonLink>
        <Link
          href={`/services#${service.slug}`}
          className={cn("inline-flex items-center gap-1.5 px-3 text-sm underline-offset-4 hover:underline", dark ? "text-porcelain/80 hover:text-porcelain" : "text-pine")}
        >
          Learn more <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
