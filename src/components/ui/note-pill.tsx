import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Porcelain notification pill that floats over pine panels. */
export function NotePill({ text, tag, className }: { text: string; tag?: string; className?: string }) {
  return (
    <span className={cn("note-pill", className)}>
      <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-pine">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="truncate">{text}</span>
      {tag && <span className="font-mono text-[11px] text-fg-3">{tag}</span>}
    </span>
  );
}

/** Mono status line used at the top-left of pine panels: "LIVE SYSTEM VIEW · ● 6 BLOCKS CONNECTED". */
export function PanelStatus({ label, value, className }: { label: string; value?: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] uppercase tracking-[0.08em] text-porcelain/60", className)}>
      {label}
      {value !== undefined && (
        <>
          {" · "}
          <span className="text-lime">
            <span aria-hidden className="status-dot mr-1.5 inline-block size-1.5 rounded-full bg-lime align-middle" />
            {value}
          </span>
        </>
      )}
    </p>
  );
}
