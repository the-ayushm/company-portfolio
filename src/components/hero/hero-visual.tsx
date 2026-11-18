"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Lazy-loads the Three.js hero scene after first paint, only when WebGL is available
 * and the user hasn't requested reduced motion. Pauses rendering when off-screen.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const [inView, setInView] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* eslint-disable react-hooks/set-state-in-effect -- feature detection (matchMedia / WebGL) is browser-only */
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    if (reduce || !supportsWebGL()) {
      setMode("static");
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    // Defer the heavy chunk until the browser is idle so it doesn't compete with first paint.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => setMode("3d");
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[5]"
    >
      <StaticVisual visible={mode !== "3d"} />
      {mode === "3d" && (
        <div className="absolute inset-0 animate-[fade-in_1.6s_var(--ease-out)_both] opacity-50 [mask-image:linear-gradient(to_bottom,black_18%,transparent_42%)] md:opacity-100 md:[mask-image:linear-gradient(100deg,transparent_18%,rgba(0,0,0,0.35)_42%,black_62%)]">
          <HeroScene active={inView} lowPower={mobile} />
        </div>
      )}
      <style>{`@keyframes fade-in{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/** Lightweight SVG composition used while loading, for reduced motion, or without WebGL. */
function StaticVisual({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000 md:justify-end md:pr-[6vw]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg viewBox="0 0 400 400" className="h-[min(78vh,640px)] w-[min(78vh,640px)] opacity-60">
        <defs>
          <radialGradient id="sv-core" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#a77bff" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#6d7cff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#08090d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="120" fill="url(#sv-core)" />
        {[150, 175, 196].map((r, i) => (
          <ellipse
            key={r}
            cx="200"
            cy="200"
            rx={r}
            ry={r * (0.35 + i * 0.12)}
            fill="none"
            stroke="rgba(245,245,247,0.16)"
            transform={`rotate(${-20 + i * 35} 200 200)`}
          />
        ))}
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          const r = 110 + ((i * 37) % 60);
          return <circle key={i} cx={200 + Math.cos(a) * r} cy={200 + Math.sin(a) * r * 0.8} r="1.6" fill="#7ee8fa" opacity="0.7" />;
        })}
      </svg>
    </div>
  );
}
