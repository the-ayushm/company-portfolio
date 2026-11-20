import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Clay palette: top face / side colour pairs shared with the WebGL blocks. */
export const clay = {
  sage: { top: "#A9C8B4", side: "#7FA28C" },
  lilac: { top: "#C7BEF0", side: "#968BCB" },
  apricot: { top: "#F4B98A", side: "#CC8B5C" },
  white: { top: "#F6F5F1", side: "#BDBBB2" },
  lime: { top: "#C6F432", side: "#8FB514" },
  pine: { top: "#1E4A3F", side: "#0A211B" },
} as const;
export type ClayName = keyof typeof clay;

export type IsoBlockSpec = {
  /** Position and footprint in px inside the scene plane. */
  x: number;
  y: number;
  w: number;
  d: number;
  /** Extrusion height in px. */
  h: number;
  color: ClayName;
  label?: string;
  title?: string;
  lines?: number;
  /** Seconds — staggers the idle float. */
  phase?: number;
  float?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * One rounded CSS-3D block, built from stacked layers so the rounded corners extrude cleanly.
 * Must sit inside an <IsoScene>.
 */
export function IsoBlock({ x, y, w, d, h, color, label, title, lines = 0, phase, float, className, children }: IsoBlockSpec) {
  const c = clay[color];
  const layers = Math.max(2, Math.min(12, Math.round(h / 2)));
  const scale = Math.min(w, d);
  return (
    <div
      className={cn("iso-block", float && "iso-float", className)}
      style={
        {
          left: x,
          top: y,
          width: w,
          height: d,
          "--iso-top": c.top,
          "--iso-side": c.side,
          "--iso-r": `${Math.round(scale * 0.2)}px`,
          animationDelay: phase !== undefined ? `${-phase}s` : undefined,
        } as CSSProperties
      }
    >
      <span className="iso-shadow" />
      {Array.from({ length: layers }, (_, i) => (
        <span key={i} className="iso-layer" style={{ transform: `translateZ(${(i * h) / layers}px)` }} />
      ))}
      <span className="iso-top flex flex-col justify-between" style={{ transform: `translateZ(${h}px)`, padding: scale * 0.12 }}>
        {label && (
          <span className="font-mono uppercase leading-none tracking-[0.08em] text-pine/70" style={{ fontSize: Math.max(5, scale * 0.07) }}>
            {label}
          </span>
        )}
        {lines > 0 && (
          <span className="flex flex-col gap-[3px]" style={{ gap: scale * 0.05 }}>
            {Array.from({ length: lines }, (_, i) => (
              <span key={i} className="block rounded-full bg-pine/[0.16]" style={{ height: Math.max(2, scale * 0.045), width: `${78 - i * 18}%` }} />
            ))}
          </span>
        )}
        {title && (
          <span className="font-medium leading-none tracking-[-0.03em] text-pine" style={{ fontSize: Math.max(7, scale * 0.17) }}>
            {title}
          </span>
        )}
        {children}
      </span>
    </div>
  );
}

/**
 * Isometric stage for CSS-3D blocks. `width`/`height` size the plane the blocks are placed on;
 * the stage scales it to fit its box and keeps it centred.
 */
export function IsoScene({
  width,
  height,
  scale = 1,
  box,
  className,
  sceneClassName,
  children,
}: {
  width: number;
  height: number;
  scale?: number;
  /** Fixed outer size in px (iso projections are wider than their footprint). */
  box?: { w: number; h: number };
  className?: string;
  sceneClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative grid place-items-center [perspective:1600px]", className)}
      style={box ? { width: box.w, height: box.h } : undefined}
    >
      <div style={{ width, height, transform: `scale(${scale})` }} className="relative [transform-style:preserve-3d]">
        <div className={cn("iso-scene absolute inset-0", sceneClassName)}>{children}</div>
      </div>
    </div>
  );
}

/** A single tiny block used as an icon (marquee chips, service rows, cards). */
export function MiniBlock({ color, size = 18, className }: { color: ClayName; size?: number; className?: string }) {
  return (
    <IsoScene width={size} height={size} box={{ w: size * 1.45, h: size * 1.1 }} className={cn("shrink-0", className)} sceneClassName="iso-hover">
      <IsoBlock x={0} y={0} w={size} d={size} h={Math.max(4, size * 0.38)} color={color} />
    </IsoScene>
  );
}
