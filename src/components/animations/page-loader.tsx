"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "intro-played";
const snap = [0.34, 1.56, 0.64, 1] as const;

/**
 * Branded intro (≈1.4s) shown once per session: the logo's three blocks drop into the pine
 * square one by one, then the loader wipes away. Page content renders underneath immediately.
 */
export function PageLoader() {
  const [show, setShow] = useState(true);

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
    const t = setTimeout(() => setShow(false), 1450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.intro = show ? "playing" : "done";
    if (!show) window.dispatchEvent(new Event("intro:done"));
  }, [show]);

  const drop = (delay: number) => ({
    initial: { y: -70, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { y: { duration: 0.5, delay, ease: snap }, opacity: { duration: 0.15, delay } },
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          aria-hidden
          className="fixed inset-0 z-[120] grid place-items-center bg-bg"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.svg
              viewBox="0 0 86 86"
              className="size-24 overflow-visible drop-shadow-[0_14px_30px_rgba(14,43,36,0.25)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <rect width="86" height="86" rx="26" fill="#0E2B24" />
              <motion.rect x="18" y="18" width="22" height="50" rx="9" fill="#A9C8B4" {...drop(0.3)} />
              <motion.rect x="46" y="18" width="22" height="22" rx="9" fill="#C7BEF0" {...drop(0.55)} />
              <motion.rect x="46" y="46" width="22" height="22" rx="9" fill="#C6F432" {...drop(0.8)} />
            </motion.svg>
            <motion.p
              className="text-[1.6rem] font-medium tracking-[-0.05em] text-pine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {siteConfig.brand.wordmark}
              <span className="text-lime">.</span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
