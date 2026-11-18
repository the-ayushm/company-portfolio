"use client";

import { useEffect, useState } from "react";

/** Tracks which section (by id) is currently around the upper-middle of the viewport. */
export function useActiveSection(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (!enabled) return;
    const els = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        // Choose the visible section closest to the top band.
        let best: string | null = null;
        let bestTop = -Infinity;
        for (const [id, top] of visible) if (top <= window.innerHeight * 0.4 && top > bestTop) {
          best = id;
          bestTop = top;
        }
        if (!best && visible.size) best = [...visible.keys()][0]!;
        if (best) setActive(best);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, enabled]);

  return active;
}
