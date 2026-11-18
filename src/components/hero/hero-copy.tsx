"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { TextReveal } from "@/components/animations/text-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { useIntroReady } from "@/hooks/use-intro-ready";
import { scrollToId } from "@/lib/utils/scroll";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroCopy({ availability }: { availability: string | null }) {
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -120]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease },
  });

  return (
    <motion.div style={{ y, opacity }} className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-16 md:pb-14">
      <div className="max-w-[min(100%,1100px)]">
        {availability && (
          <motion.div {...fade(0)} className="mb-8 inline-flex items-center gap-3 rounded-full border border-line bg-bg/40 py-1.5 pl-2 pr-4 backdrop-blur-md">
            <span className="relative grid size-5 place-items-center">
              <span className="status-dot size-2 rounded-full bg-success" />
            </span>
            <span className="text-[0.82rem] text-fg-2">{availability}</span>
          </motion.div>
        )}

        {ready ? (
          <TextReveal
            as="h1"
            id="hero-title"
            immediate
            delay={0.05}
            stagger={0.06}
            className="display text-[clamp(2.9rem,8.4vw,8.4rem)] leading-[0.92] text-balance"
            segments={[
              "Engineering",
              { text: "Digital Experiences", serif: true, gradient: true },
              "That Move Businesses Forward.",
            ]}
          />
        ) : (
          <h1 id="hero-title" className="display text-[clamp(2.9rem,8.4vw,8.4rem)] leading-[0.92] text-balance opacity-0">
            Engineering Digital Experiences That Move Businesses Forward.
          </h1>
        )}

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <motion.p {...fade(0.55)} className="max-w-xl text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-fg-2">
            We design, develop and scale powerful digital solutions for businesses ready to grow — from first
            requirements to production and long-term support.
          </motion.p>
          <motion.div {...fade(0.7)} className="flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink
                href="/#work"
                size="lg"
                variant="ghost"
                onClick={(e) => scrollToId("work") && e.preventDefault()}
              >
                Explore Our Work
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/#contact" size="lg" onClick={(e) => scrollToId("contact") && e.preventDefault()}>
                Start a Project
              </ButtonLink>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...fade(0.95)}
        className="mt-14 flex items-center justify-between border-t border-line pt-5 text-fg-3"
      >
        <button
          type="button"
          onClick={() => scrollToId("capabilities", 0)}
          className="group inline-flex items-center gap-3 eyebrow transition-colors hover:text-fg"
          aria-label="Scroll to content"
        >
          <span className="relative grid h-9 w-6 place-items-start justify-center rounded-full border border-line-strong p-1">
            <motion.span
              className="block h-2 w-0.5 rounded-full bg-fg"
              animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll
          <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
        </button>
        <p className="hidden eyebrow md:block">Requirements → Architecture → Build → Deploy → Support</p>
      </motion.div>
    </motion.div>
  );
}
