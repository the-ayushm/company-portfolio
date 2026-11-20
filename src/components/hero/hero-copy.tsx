"use client";

import { motion, useReducedMotion } from "motion/react";
import { TextReveal } from "@/components/animations/text-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { useIntroReady } from "@/hooks/use-intro-ready";
import { scrollToId } from "@/lib/utils/scroll";

const ease = [0.16, 1, 0.3, 1] as const;
const title = "We turn spreadsheets, chats & busywork into systems that run themselves.";
const h1 = "display text-[clamp(2.4rem,4.2vw,4.4rem)] text-balance";

export function HeroCopy({ availability }: { availability: string | null }) {
  const ready = useIntroReady();
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <div className="relative">
      {availability && (
        <motion.div {...fade(0)} className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-card py-2 pl-3 pr-4 shadow-[var(--shadow-card)]">
          <span className="status-dot size-2 rounded-full bg-lime ring-1 ring-lime-deep/60" aria-hidden />
          <span className="text-[0.82rem] text-fg-2">{availability}</span>
        </motion.div>
      )}
      <motion.p {...fade(0.05)} className="eyebrow mb-5">
        Custom software · ERP · CRM · WhatsApp automation
      </motion.p>

      {ready ? (
        <TextReveal
          as="h1"
          id="hero-title"
          immediate
          delay={0.1}
          stagger={0.05}
          className={h1}
          segments={["We turn spreadsheets, chats & busywork into", { text: "systems that run themselves.", hl: true }]}
        />
      ) : (
        <h1 id="hero-title" className={`${h1} opacity-0`}>
          {title}
        </h1>
      )}

      <motion.p {...fade(0.55)} className="lead mt-7 max-w-[34rem]">
        Your CRM, orders, payroll and WhatsApp live in different places today.{" "}
        <strong className="font-medium text-pine">We connect them into one custom system</strong> — designed, built, automated
        and supported by our team.
      </motion.p>
      <motion.div {...fade(0.7)} className="mt-9 flex flex-wrap gap-3">
        <Magnetic>
          <ButtonLink href="/#contact" size="lg" onClick={(e) => scrollToId("contact") && e.preventDefault()}>
            Automate my business
          </ButtonLink>
        </Magnetic>
        <Magnetic>
          <ButtonLink href="/#process" size="lg" variant="ghost" icon={false} onClick={(e) => scrollToId("process") && e.preventDefault()}>
            How it works
          </ButtonLink>
        </Magnetic>
      </motion.div>
    </div>
  );
}
