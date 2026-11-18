"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/projects/project-visual";
import { TiltCard } from "@/components/animations/tilt-card";
import { pad2 } from "@/lib/utils/format";
import type { ProjectContent } from "@/types/content";

/** Large project cards that pin and stack as you scroll (desktop), scaling back as the next arrives. */
export function ProjectStack({ projects }: { projects: ProjectContent[] }) {
  return (
    <ol className="mt-20 flex flex-col gap-8 lg:gap-0">
      {projects.map((p, i) => (
        <StackCard key={p.slug} project={p} index={i} total={projects.length} />
      ))}
    </ol>
  );
}

function StackCard({ project: p, index, total }: { project: ProjectContent; index: number; total: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const last = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce || last ? 1 : 0.9]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, reduce || last ? 0 : 0.55]);

  const tags = p.features.slice(0, 4);

  return (
    <li ref={ref} className="lg:sticky lg:h-[min(86vh,760px)] lg:pb-10" style={{ top: `${96 + index * 14}px` }}>
      <motion.div style={{ scale }} className="h-full origin-top will-change-transform">
        <TiltCard max={3} className="rounded-[var(--radius-lg)]">
          <Link
            href={`/work/${p.slug}`}
            data-cursor-label="View"
            className="group relative grid h-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]"
          >
            <div className="relative z-10 flex flex-col gap-6 p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-fg-3">
                  {pad2(index + 1)} / {pad2(total)}
                </span>
                <span className="size-2 rounded-full" style={{ background: p.accent }} aria-hidden />
              </div>
              <div>
                <p className="eyebrow mb-4" style={{ color: p.accent }}>
                  {p.category}
                </p>
                <h3 className="display text-[clamp(2.2rem,4.4vw,4rem)]">{p.title}</h3>
              </div>
              <p className="max-w-md leading-relaxed text-fg-2">{p.summary}</p>
              {tags.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Key capabilities">
                  {tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1.5 text-xs text-fg-2">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              {p.techStack.length > 0 && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg-3" aria-label="Technology">
                  {p.techStack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <span className="mt-auto inline-flex items-center gap-3 pt-4 text-sm font-medium">
                <span className="relative">
                  View Project
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-500 group-hover:scale-x-100" />
                </span>
                <span className="grid size-9 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </span>
            </div>
            <motion.div
              className="relative min-h-[260px] sm:min-h-[340px]"
              initial={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(12% 12% 12% 12% round 24px)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectVisual
                project={p}
                priority={index === 0}
                className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.035]"
              />
            </motion.div>
            <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-bg" />
          </Link>
        </TiltCard>
      </motion.div>
    </li>
  );
}
