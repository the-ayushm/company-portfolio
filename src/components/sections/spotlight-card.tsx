"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Card with a soft radial spotlight that follows the pointer (CSS variables, no re-renders). */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card transition-colors duration-500 hover:border-line-strong",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--sx,50%)_var(--sy,50%),rgba(109,124,255,0.14),transparent_60%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
