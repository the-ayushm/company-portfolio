"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Perspective tilt + moving specular highlight on pointer hover (mouse only). */
export function TiltCard({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(500px circle at ${gx} ${gy}, rgba(255,255,255,0.09), transparent 45%)`;
  const hover = useMotionValue(0);
  const glareOpacity = useSpring(hover, { stiffness: 200, damping: 30 });

  return (
    <div style={{ perspective: 1100 }} className={cn("h-full", className)}>
      <motion.div
        ref={ref}
        className="relative h-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          hover.set(1);
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          hover.set(0);
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare, opacity: glareOpacity }} />
      </motion.div>
    </div>
  );
}
