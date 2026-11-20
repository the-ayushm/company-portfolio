"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BlocksPanel, type PanelState } from "@/components/three/blocks-panel";
import { NotePill, PanelStatus } from "@/components/ui/note-pill";
import { heroBlocks, heroIntroOrder, heroMobileHidden } from "@/config/blocks";
import { notifications } from "@/config/notifications";
import { selectService } from "@/lib/utils/service-select";
import { cn } from "@/lib/utils/cn";

const ease = [0.16, 1, 0.3, 1] as const;

/** Pill anchors over the panel (desktop), as on the approved board. */
const slots = [
  { className: "left-[5%] top-[25%] max-md:top-[12%]", speed: -40 },
  { className: "right-[4%] top-[12%] max-md:top-auto max-md:bottom-[7%] max-md:right-[5%]", speed: -70 },
  { className: "right-[7%] bottom-[7%] max-md:hidden", speed: -100 },
];

export function HeroVisual({ tooltips }: { tooltips: Record<string, string> }) {
  const wrap = useRef<HTMLDivElement>(null);
  // Board order: salary slips (top-left), new lead (top-right), low stock (bottom-right).
  const [shown, setShown] = useState([1, 0, 2]);
  const cursor = useRef({ slot: 0, next: 3 });

  const onPulse = () => {
    const c = cursor.current;
    const slot = c.slot;
    const msg = c.next;
    c.slot = (c.slot + 1) % slots.length;
    c.next = (c.next + 1) % notifications.length;
    setShown((s) => s.map((v, i) => (i === slot ? msg : v)));
  };

  return (
    <div ref={wrap} className="relative">
      <BlocksPanel
        blocks={heroBlocks}
        mobileHidden={heroMobileHidden}
        introOrder={heroIntroOrder}
        tooltips={tooltips}
        onPulse={onPulse}
        onSelect={(b) => b.service && selectService(b.service)}
        className="aspect-[4/5] w-full md:aspect-[1020/742]"
        poster={<Image src="/images/hero-blocks.png" alt="" fill priority sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />}
      >
        {(state) => <Overlay state={state} shown={shown} wrap={wrap} />}
      </BlocksPanel>
      <p className="sr-only">
        Illustration: business modules — WhatsApp, CRM, Orders, Payroll, Reports and Stock — snap into one automated core.
      </p>
    </div>
  );
}

function Overlay({ state, shown, wrap }: { state: PanelState; shown: number[]; wrap: React.RefObject<HTMLDivElement | null> }) {
  const { started, reduced, modules } = state;
  const count = useCountUp(modules, started, reduced);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end start"] });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <PanelStatus label="Live system view" value={`${count} blocks connected`} className="absolute left-6 top-5 sm:left-8 sm:top-7" />
      {slots.map((slot, i) => (
        <Pill key={i} index={i} slot={slot} msg={shown[i]!} started={started} reduced={reduced} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Pill({
  index,
  slot,
  msg,
  started,
  reduced,
  progress,
}: {
  index: number;
  slot: (typeof slots)[number];
  msg: number;
  started: boolean;
  reduced: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, reduced ? 0 : slot.speed]);
  const n = notifications[msg]!;
  return (
    <motion.div className={cn("absolute max-w-[calc(100%-2.5rem)]", slot.className)} style={{ y }}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: reduced ? 0 : 12 }}
        animate={started ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, delay: reduced ? 0 : 1.55 + index * 0.15, ease }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={msg}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={{ duration: 0.4, ease }}
          >
            <NotePill text={n.text} tag={n.tag} className="max-w-full text-[12px] sm:text-[13px] 2xl:text-[14px]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/** Counts 0 → target once `started` (the status line "0 → 6 BLOCKS CONNECTED"). */
function useCountUp(target: number, started: boolean, reduced: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jump straight to the final value
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + 900;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1400));
      setValue(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, started, reduced]);
  return value;
}
