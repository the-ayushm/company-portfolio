"use client";

import { useEffect, useState } from "react";

/** Resolves true once the page intro loader has finished (or immediately if it didn't play). */
export function useIntroReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const check = () => document.documentElement.dataset.intro !== "playing";
    if (check()) {
      // Allow one frame so the loader can claim "playing" on first visit.
      const id = requestAnimationFrame(() => check() && setReady(true));
      const onDone = () => setReady(true);
      window.addEventListener("intro:done", onDone);
      return () => {
        cancelAnimationFrame(id);
        window.removeEventListener("intro:done", onDone);
      };
    }
    const onDone = () => setReady(true);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, []);
  return ready;
}
