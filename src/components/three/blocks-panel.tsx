"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { BlockSpec } from "@/components/three/block";
import { useIntroReady } from "@/hooks/use-intro-ready";
import { cn } from "@/lib/utils/cn";

const BlocksScene = dynamic(() => import("@/components/three/blocks-scene"), { ssr: false, loading: () => null });

function canRender3D(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export type PanelState = {
  /** The assembly has started (or the static/assembled state is showing). */
  started: boolean;
  reduced: boolean;
  mobile: boolean;
  /** Number of module blocks currently shown (excludes the core). */
  modules: number;
};

/**
 * Pine panel hosting a WebGL block scene. Shows `poster` until the first 3D frame renders,
 * and keeps it (no canvas at all) without WebGL, on save-data or very low-end devices.
 * Rendering pauses while the panel is off-screen.
 */
export function BlocksPanel({
  blocks,
  mobileHidden = [],
  introOrder,
  pulses = true,
  interactive = true,
  tooltips,
  poster,
  className,
  onPulse,
  onSelect,
  children,
}: {
  blocks: BlockSpec[];
  mobileHidden?: string[];
  introOrder?: string[];
  pulses?: boolean;
  interactive?: boolean;
  tooltips?: Record<string, string>;
  poster: ReactNode;
  className?: string;
  onPulse?: (blockId: string) => void;
  onSelect?: (block: BlockSpec) => void;
  children?: (state: PanelState) => ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const introReady = useIntroReady();
  const reduced = Boolean(useReducedMotion());
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const [mobile, setMobile] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- feature detection is browser-only */
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    if (!canRender3D()) {
      setMode("static");
      return;
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const go = () => setMode("3d");
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 900 });
    else setTimeout(go, 200);
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = useMemo(() => (mobile ? blocks.filter((b) => !mobileHidden.includes(b.id)) : blocks), [blocks, mobile, mobileHidden]);
  const is3d = mode === "3d";
  const started = introReady && (mode === "static" || ready);

  return (
    <div ref={panel} className={cn("pine-panel", className)}>
      <div aria-hidden className={cn("absolute inset-0 transition-opacity duration-700", is3d && ready ? "opacity-0" : "opacity-100")}>
        {poster}
      </div>
      {is3d && (
        <div className={cn("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
          <BlocksScene
            blocks={visible}
            introOrder={introOrder}
            active={inView}
            start={started}
            reduced={reduced}
            mobile={mobile}
            panel={panel}
            pulses={pulses}
            interactive={interactive}
            tooltips={tooltips}
            onPulse={onPulse}
            onSelect={onSelect}
            onReady={() => setReady(true)}
          />
        </div>
      )}
      {children?.({ started, reduced, mobile, modules: visible.filter((b) => !b.core).length })}
    </div>
  );
}
