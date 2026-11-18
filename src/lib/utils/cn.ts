import { twMerge } from "tailwind-merge";

type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, boolean | null | undefined>;

/**
 * Joins class names and resolves conflicting Tailwind utilities so the
 * last one wins (e.g. a caller's `absolute` overrides a component's `relative`).
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") out.push(String(v));
    else if (Array.isArray(v)) v.forEach(walk);
    else for (const [k, on] of Object.entries(v)) if (on) out.push(k);
  };
  inputs.forEach(walk);
  return twMerge(out.join(" "));
}
