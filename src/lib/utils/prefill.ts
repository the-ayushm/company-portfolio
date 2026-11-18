"use client";

import { serviceToProjectType } from "@/config/contact";
import { scrollToId } from "@/lib/utils/scroll";

export const PREFILL_EVENT = "contact:prefill";
const KEY = "contact-prefill";

/** Pre-selects a project type in the contact form, then scrolls to it (or navigates home). */
export function discussService(serviceSlug: string): boolean {
  const projectType = serviceToProjectType[serviceSlug] ?? "Other";
  try {
    sessionStorage.setItem(KEY, projectType);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: projectType }));
  return scrollToId("contact");
}

export function consumePrefill(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return v;
  } catch {
    return null;
  }
}
