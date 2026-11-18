"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "intro-played";

/**
 * Brief branded intro (≈1.3s) shown once per session.
 * Page content renders underneath immediately, so it never delays LCP-critical HTML.
 */
export function PageLoader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable — just play */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (played || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on browser-only state (sessionStorage / matchMedia) unavailable during SSR
      setShow(false);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.intro = show ? "playing" : "done";
    if (!show) window.dispatchEvent(new Event("intro:done"));
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          aria-hidden
          className="fixed inset-0 z-[120] flex flex-col justify-between bg-bg p-[var(--gutter)]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between eyebrow">
            <span>{siteConfig.brand.name}</span>
            <span>Engineering studio</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.p
                className="display text-[clamp(2.5rem,8vw,7rem)]"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Build<span className="accent-serif text-accent"> / </span>Ship<span className="accent-serif text-accent"> / </span>Scale
              </motion.p>
            </div>
            <span className="font-mono text-[clamp(2rem,6vw,5rem)] tabular-nums leading-none text-fg-2">
              {String(count).padStart(3, "0")}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-line">
            <div className="h-full bg-gradient-to-r from-accent to-signal" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
