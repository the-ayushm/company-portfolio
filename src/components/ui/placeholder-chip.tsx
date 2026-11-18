import { cn } from "@/lib/utils/cn";

/**
 * Visible marker for content the team still needs to confirm.
 * Rendered only while siteConfig.showContentPlaceholders is true.
 */
export function PlaceholderChip({ label = "To be confirmed", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-warning/40 bg-warning/[0.06] px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-warning/90",
        className,
      )}
    >
      <span aria-hidden className="size-1 rounded-full bg-warning/80" />
      {label}
    </span>
  );
}
