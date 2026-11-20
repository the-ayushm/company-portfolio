"use client";

import { scrollToId } from "@/lib/utils/scroll";

export const SERVICE_SELECT_EVENT = "service:select";

/** Selects a service in the Services explorer and scrolls to it. */
export function selectService(slug: string) {
  window.dispatchEvent(new CustomEvent(SERVICE_SELECT_EVENT, { detail: slug }));
  scrollToId("services");
}
