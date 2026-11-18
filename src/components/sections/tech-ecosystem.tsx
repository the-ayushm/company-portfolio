"use client";

import { useState, type CSSProperties } from "react";
import { techGroups, techStack, type TechGroup } from "@/config/tech";
import { LogoMark } from "@/components/layout/logo";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils/cn";

const rings = [
  { radius: 34, duration: 60, items: techStack.slice(0, 4) },
  { radius: 62, duration: 90, items: techStack.slice(4, 8) },
  { radius: 90, duration: 120, items: techStack.slice(8) },
];

export function TechEcosystem() {
  const [focus, setFocus] = useState<TechGroup | null>(null);

  return (
    <section id="technology" aria-labelledby="tech-title" className="section-y relative overflow-hidden">
      <div className="container-x">
        <SectionHeading
          id="tech-title"
          index="06"
          eyebrow="Technology"
          title={["Powered by", { text: "Modern", serif: true }, "Technology."]}
          description="The tools we work with day to day. Each project uses the subset that fits its requirements — not every technology on every project."
        />

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Orbit visual */}
          <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[620px] sm:block">
            {rings.map((ring, ri) => (
              <div
                key={ri}
                className="absolute left-1/2 top-1/2 rounded-full border border-line"
                style={{ width: `${ring.radius}%`, height: `${ring.radius}%`, transform: "translate(-50%,-50%)" }}
              >
                <div
                  className="absolute inset-0 motion-safe:animate-[orbit_var(--d)_linear_infinite]"
                  style={{ "--d": `${ring.duration}s`, animationDirection: ri % 2 ? "reverse" : "normal" } as CSSProperties}
                >
                  {ring.items.map((t, i) => {
                    const angle = (i / ring.items.length) * Math.PI * 2 + ri;
                    const dim = focus && focus !== t.group;
                    return (
                      <span
                        key={t.name}
                        className="absolute"
                        style={{ left: `${50 + Math.cos(angle) * 50}%`, top: `${50 + Math.sin(angle) * 50}%`, transform: "translate(-50%,-50%)" }}
                      >
                        <span
                          className="block motion-safe:animate-[orbit-reverse_var(--d)_linear_infinite]"
                          style={{ "--d": `${ring.duration}s`, animationDirection: ri % 2 ? "reverse" : "normal" } as CSSProperties}
                        >
                          <span
                            className={cn(
                              "flex items-center gap-2 whitespace-nowrap rounded-full border bg-bg-2/90 px-3.5 py-2 text-xs backdrop-blur transition-all duration-500",
                              dim ? "scale-90 border-line opacity-25" : "border-line-strong opacity-100",
                              focus === t.group && "scale-110 border-accent/50 shadow-[0_0_30px_-6px_var(--accent)]",
                            )}
                          >
                            <span className="size-2 rounded-full" style={{ background: t.color }} />
                            {t.name}
                          </span>
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-card shadow-[0_0_80px_-10px_rgba(109,124,255,0.6)]">
              <LogoMark className="size-10" />
            </div>
          </div>

          {/* Accessible grouped list (doubles as filter) */}
          <div className="flex flex-col gap-3">
            {techGroups.map((g) => (
              <button
                key={g}
                type="button"
                onMouseEnter={() => setFocus(g)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(g)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus((f) => (f === g ? null : g))}
                aria-pressed={focus === g}
                className={cn(
                  "group rounded-[var(--radius)] border p-5 text-left transition-colors duration-300",
                  focus === g ? "border-accent/40 bg-accent/[0.05]" : "border-line hover:border-line-strong",
                )}
              >
                <span className="eyebrow">{g}</span>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {techStack
                    .filter((t) => t.group === g)
                    .map((t) => (
                      <li key={t.name} className="flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-sm">
                        <span aria-hidden className="size-1.5 rounded-full" style={{ background: t.color }} />
                        {t.name}
                      </li>
                    ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
