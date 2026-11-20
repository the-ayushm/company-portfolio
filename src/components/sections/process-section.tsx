"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import { IsoBlock, IsoScene, type ClayName } from "@/components/ui/iso-block";
import { PanelStatus } from "@/components/ui/note-pill";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

const steps: { title: string; label: string; text: string; color: ClayName; h: number }[] = [
  {
    title: "Map",
    label: "01 · MAP",
    text: "We sit with your team, map how work really flows today and pick the blocks worth automating first.",
    color: "sage",
    h: 22,
  },
  {
    title: "Design",
    label: "02 · DESIGN",
    text: "We plan the data, the workflows and the screens — and agree on the system before any code is written.",
    color: "lilac",
    h: 26,
  },
  {
    title: "Build",
    label: "03 · BUILD",
    text: "We build it in small pieces you can see and try — frontend, backend and integrations, tested as we go.",
    color: "apricot",
    h: 22,
  },
  {
    title: "Automate & support",
    label: "04 · RUN",
    text: "We switch on the automations, launch, train your team and stay on for support when agreed.",
    color: "lime",
    h: 34,
  },
];

const SIZE = 220;

/** Each step's block sits on top of the previous ones. */
const stack = steps.map((s, i) => ({ ...s, i, z: steps.slice(0, i).reduce((sum, p) => sum + p.h + 6, 0) }));

export function ProcessSection() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // Desktop: pin the section and stack one block per step as you scroll.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: section.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          pin: true,
          onUpdate: (s) => setStep(Math.min(steps.length - 1, Math.floor(s.progress * steps.length))),
        });
        return () => st.kill();
      });
      // Smaller screens and reduced motion: everything is shown at once.
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        setStep(steps.length - 1);
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="process" aria-labelledby="process-title" className="relative overflow-hidden py-[var(--section-y)] lg:flex lg:min-h-screen lg:items-center lg:py-20">
      <div className="container-x grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            id="process-title"
            index="03"
            eyebrow="Process"
            align="left"
            title={["How we", { text: "build it.", hl: true }]}
            description="Four steps, one block at a time — so you always know what's being built, why, and what comes next."
          />
          <ol className="mt-10 flex flex-col gap-2">
            {steps.map((s, i) => {
              const on = i <= step;
              const current = i === step;
              return (
                <li
                  key={s.title}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex gap-5 rounded-[22px] p-5 transition-[background-color,box-shadow,opacity] duration-500",
                    current ? "bg-card shadow-[var(--shadow-card)]" : "",
                    on ? "opacity-100" : "opacity-45",
                  )}
                >
                  <span className="pt-1 font-mono text-xs text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="flex items-center gap-2.5 text-xl font-medium tracking-[-0.03em] text-pine">
                      {s.title}
                      {on && <span aria-hidden className="size-1.5 rounded-full bg-lime ring-1 ring-lime-deep/60" />}
                    </span>
                    <span className="mt-1.5 block font-light leading-relaxed text-fg-2">{s.text}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="pine-panel on-pine relative aspect-square w-full max-lg:max-h-[520px] lg:aspect-[5/6]">
          <PanelStatus label="Build progress" value={`${step + 1} / ${steps.length} blocks stacked`} className="absolute left-7 top-6" />
          <IsoScene width={SIZE} height={SIZE} className="absolute inset-0 translate-y-[12%]">
            {stack.map((s) => {
              const placed = s.i <= step;
              return (
                <div
                  key={s.title}
                  className="absolute inset-0 [transform-style:preserve-3d]"
                  style={{
                    transform: `translateZ(${s.z + (placed ? 0 : 160)}px)`,
                    opacity: placed ? 1 : 0,
                    transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease-out",
                  }}
                >
                  <IsoBlock x={0} y={0} w={SIZE} d={SIZE} h={s.h} color={s.color} label={s.label} title={s.title.split(" ")[0]} lines={s.i < 3 ? 2 : 0} />
                </div>
              );
            })}
          </IsoScene>
        </div>
      </div>
    </section>
  );
}
