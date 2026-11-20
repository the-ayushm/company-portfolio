"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/projects/project-visual";
import { TiltCard } from "@/components/animations/tilt-card";
import { pad2 } from "@/lib/utils/format";
import type { ProjectContent } from "@/types/content";

/** Project cards that pin and stack as you scroll (desktop), scaling back as the next arrives. */
export function ProjectStack({ projects }: { projects: ProjectContent[] }) {
  return (
    <ol className="mt-16 flex flex-col gap-6 lg:mt-20 lg:gap-0">
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
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce || last ? 1 : 0.92]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, reduce || last ? 0 : 0.5]);
  const tags = p.features.slice(0, 4);

  return (
    <li ref={ref} className="lg:sticky lg:h-[min(80vh,640px)] lg:pb-8" style={{ top: `${100 + index * 14}px` }}>
      <motion.div style={{ scale }} className="h-full origin-top will-change-transform">
        <TiltCard max={2.5} className="rounded-[var(--radius-lg)]">
          <Link
            href={`/work/${p.slug}`}
            className="group card relative grid h-full overflow-hidden p-3 transition-shadow duration-500 hover:shadow-[var(--shadow-card-hover)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
          >
            <div className="relative z-10 flex flex-col gap-5 p-5 sm:p-8">
              <span className="eyebrow">
                {pad2(index + 1)} / {pad2(total)} · {p.category}
              </span>
              <h3 className="display text-[clamp(2rem,3.6vw,3.2rem)]">{p.title}</h3>
              <p className="max-w-md font-light leading-relaxed text-fg-2">{p.summary}</p>
              {tags.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Key capabilities">
                  {tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <span className="mt-auto inline-flex items-center gap-3 pt-2 font-medium text-pine">
                View case study
                <span className="grid size-9 place-items-center rounded-full bg-lime transition-transform duration-500 ease-[var(--ease-snap)] group-hover:translate-x-1 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </span>
            </div>
            <ProjectVisual project={p} priority={index === 0} className="min-h-[280px] sm:min-h-[340px] lg:min-h-0" />
            <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-bg" />
          </Link>
        </TiltCard>
      </motion.div>
    </li>
  );
}
