"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Smoothly scrolls to an element id (uses Lenis when active). Returns false if not found. */
export function scrollToId(id: string, offset = -72): boolean {
  const el = id === "home" ? document.body : document.getElementById(id);
  if (!el) return false;
  if (instance) {
    instance.scrollTo(id === "home" ? 0 : el, { offset, duration: 1.4 });
  } else {
    const top = id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
  history.replaceState(null, "", id === "home" ? window.location.pathname : `#${id}`);
  return true;
}
