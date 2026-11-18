import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProjectContent } from "@/types/content";

/**
 * Project imagery. Shows the real cover screenshot when one has been uploaded;
 * otherwise renders an original, clearly-labelled illustrative interface sketch
 * (never stock photography and never presented as a real screenshot).
 */
export function ProjectVisual({
  project,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 55vw, 100vw",
}: {
  project: Pick<ProjectContent, "title" | "visual" | "accent" | "coverImage">;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (project.coverImage) {
    return (
      <div className={cn("relative overflow-hidden bg-card-2", className)}>
        <Image src={project.coverImage} alt={`${project.title} — screenshot`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    );
  }
  return (
    <div
      className={cn("relative overflow-hidden bg-[#0c0e15]", className)}
      style={{ "--pa": project.accent } as CSSProperties}
      role="img"
      aria-label={`Illustrative interface sketch for ${project.title}`}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,color-mix(in_oklab,var(--pa)_28%,transparent),transparent_70%)]" />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
      <div aria-hidden className="absolute inset-[7%] bottom-0 top-[10%]">
        <Frame>{renderSketch(project.visual)}</Frame>
      </div>
      <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-fg-2 backdrop-blur">
        Illustrative interface
      </span>
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-[#11131c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/[0.06] px-3">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ml-3 h-3 w-1/3 rounded-full bg-white/[0.05]" />
      </div>
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* ── primitives ─────────────────────────────────────────── */
const Bar = ({ w = "60%", className, accent }: { w?: string; className?: string; accent?: boolean }) => (
  <span className={cn("block h-1.5 rounded-full", accent ? "bg-[var(--pa)]" : "bg-white/10", className)} style={{ width: w }} />
);
const Side = ({ items = 6 }: { items?: number }) => (
  <div className="hidden w-[18%] shrink-0 flex-col gap-2.5 border-r border-white/[0.06] p-3 sm:flex">
    <span className="mb-2 size-5 rounded-md bg-[var(--pa)]/80" />
    {Array.from({ length: items }).map((_, i) => (
      <span key={i} className={cn("flex items-center gap-2 rounded-md px-1.5 py-1", i === 1 && "bg-white/[0.06]")}>
        <span className="size-2 rounded-sm bg-white/15" />
        <Bar w={`${50 + ((i * 17) % 40)}%`} />
      </span>
    ))}
  </div>
);
const Stat = ({ accent }: { accent?: boolean }) => (
  <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
    <Bar w="45%" />
    <span className={cn("block h-3 w-2/3 rounded", accent ? "bg-[var(--pa)]/70" : "bg-white/20")} />
  </div>
);
const Chart = () => (
  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="h-full w-full">
    <path d="M0 50 C20 44 30 30 50 34 S80 18 100 24 S140 8 160 14 S190 6 200 4 V60 H0 Z" fill="var(--pa)" opacity="0.15" />
    <path d="M0 50 C20 44 30 30 50 34 S80 18 100 24 S140 8 160 14 S190 6 200 4" fill="none" stroke="var(--pa)" strokeWidth="1.5" />
  </svg>
);

function renderSketch(visual: string) {
  switch (visual) {
    case "whatsapp-crm":
      return (
        <>
          <Side />
          <div className="flex w-[34%] shrink-0 flex-col border-r border-white/[0.06]">
            <div className="border-b border-white/[0.06] p-3"><span className="block h-5 rounded-md bg-white/[0.05]" /></div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={cn("flex items-center gap-2.5 border-b border-white/[0.04] p-3", i === 0 && "bg-[var(--pa)]/[0.08]")}>
                <span className="size-6 shrink-0 rounded-full bg-white/10" />
                <span className="flex flex-1 flex-col gap-1.5"><Bar w="55%" /><Bar w="80%" className="opacity-60" /></span>
                {i < 3 && <span className="size-3.5 rounded-full bg-[var(--pa)]" />}
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-white/[0.06] p-3"><span className="size-6 rounded-full bg-white/10" /><Bar w="30%" /><span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[7px] text-fg-3">Assigned</span></div>
            <div className="flex flex-1 flex-col justify-end gap-2.5 p-4">
              <span className="max-w-[60%] self-start rounded-xl rounded-bl-sm bg-white/[0.06] p-2.5"><Bar w="90%" /><Bar w="60%" className="mt-1.5" /></span>
              <span className="max-w-[55%] self-end rounded-xl rounded-br-sm bg-[var(--pa)]/25 p-2.5"><Bar w="85%" accent /><Bar w="50%" className="mt-1.5" /></span>
              <span className="max-w-[48%] self-start rounded-xl rounded-bl-sm border border-dashed border-[var(--pa)]/40 p-2.5"><span className="mb-1.5 block font-mono text-[6px] uppercase text-[var(--pa)]">Template</span><Bar w="80%" /></span>
              <span className="max-w-[40%] self-end rounded-xl rounded-br-sm bg-[var(--pa)]/25 p-2.5"><Bar w="70%" accent /></span>
            </div>
            <div className="m-3 mt-0 h-7 rounded-lg border border-white/[0.06] bg-white/[0.03]" />
          </div>
        </>
      );
    case "workforce":
      return (
        <>
          <Side />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex items-center justify-between"><Bar w="25%" className="h-2.5 bg-white/25" /><span className="h-5 w-16 rounded-md bg-[var(--pa)]/70" /></div>
            <div className="grid grid-cols-4 gap-2"><Stat accent /><Stat /><Stat /><Stat /></div>
            <div className="flex-1 overflow-hidden rounded-lg border border-white/[0.06]">
              <div className="grid grid-cols-[1.4fr_repeat(5,1fr)] gap-2 border-b border-white/[0.06] p-2.5">{Array.from({ length: 6 }).map((_, i) => <Bar key={i} w="70%" className="opacity-70" />)}</div>
              {Array.from({ length: 6 }).map((_, r) => (
                <div key={r} className="grid grid-cols-[1.4fr_repeat(5,1fr)] items-center gap-2 border-b border-white/[0.04] p-2.5">
                  <span className="flex items-center gap-1.5"><span className="size-4 rounded-full bg-white/10" /><Bar w="60%" /></span>
                  {Array.from({ length: 5 }).map((_, c) => (
                    <span key={c} className={cn("size-3 rounded-sm", (r + c) % 4 === 0 ? "bg-white/10" : (r * c) % 3 === 1 ? "bg-[var(--pa)]/40" : "bg-[var(--pa)]/80")} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      );
    case "ecommerce":
    case "shopify":
      return (
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-2.5">
            <span className="h-3 w-14 rounded bg-[var(--pa)]/80" />
            <span className="flex gap-3">{[0, 1, 2, 3].map((i) => <Bar key={i} w="28px" />)}</span>
            <span className="ml-auto size-4 rounded-full border border-white/20" />
          </div>
          <div className="grid flex-1 grid-cols-[1fr_1.1fr] gap-4 p-4">
            <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--pa)_40%,transparent),transparent_70%)]">
              <span className="absolute left-1/2 top-1/2 h-[58%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-[40%_40%_16px_16px] border border-white/15 bg-white/[0.06]" />
              <span className="absolute left-1/2 top-[22%] h-[8%] w-[18%] -translate-x-1/2 rounded-md bg-white/15" />
            </div>
            <div className="flex flex-col gap-2.5 py-2">
              <Bar w="30%" className="opacity-60" />
              <span className="block h-4 w-4/5 rounded bg-white/25" />
              <Bar w="40%" accent />
              <div className="mt-2 flex flex-col gap-1.5"><Bar w="95%" /><Bar w="88%" /><Bar w="70%" /></div>
              <div className="mt-2 flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className={cn("h-5 w-9 rounded-md border", i === 0 ? "border-[var(--pa)]" : "border-white/10")} />)}</div>
              <span className="mt-auto h-7 w-full rounded-lg bg-[var(--pa)]/85" />
            </div>
            <div className="col-span-2 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => <span key={i} className="aspect-[4/3] rounded-lg border border-white/[0.06] bg-white/[0.03]" />)}
            </div>
          </div>
        </div>
      );
    case "erp":
      return (
        <>
          <Side items={8} />
          <div className="grid flex-1 grid-cols-3 grid-rows-[auto_1fr_1fr] gap-2.5 p-4">
            <div className="col-span-3 flex items-center gap-2"><Bar w="22%" className="h-2.5 bg-white/25" /><span className="ml-auto h-5 w-14 rounded-md border border-white/10" /><span className="h-5 w-14 rounded-md bg-[var(--pa)]/70" /></div>
            <div className="col-span-2 flex flex-col rounded-lg border border-white/[0.06] p-3"><Bar w="30%" /><div className="mt-2 flex-1"><Chart /></div></div>
            <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] p-3">
              <Bar w="50%" />
              <svg viewBox="0 0 40 40" className="mx-auto mt-1 w-3/5"><circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" /><circle cx="20" cy="20" r="15" fill="none" stroke="var(--pa)" strokeWidth="6" strokeDasharray="62 100" transform="rotate(-90 20 20)" /></svg>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2 rounded-lg border border-white/[0.06] p-3">
                <Bar w="40%" />
                {[0, 1, 2].map((j) => <span key={j} className="flex items-center gap-2"><span className={cn("size-2 rounded-full", j === 0 ? "bg-[var(--pa)]" : "bg-white/15")} /><Bar w={`${60 + j * 10}%`} /></span>)}
              </div>
            ))}
          </div>
        </>
      );
    case "logistics":
      return (
        <>
          <Side />
          <div className="grid flex-1 grid-cols-[1.3fr_1fr] gap-3 p-4">
            <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M20 120 C60 100 50 50 100 60 S150 20 180 24" fill="none" stroke="var(--pa)" strokeWidth="1.5" strokeDasharray="4 4" />
                {[[20, 120], [100, 60], [180, 24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 1 ? 5 : 3.5} fill={i === 1 ? "var(--pa)" : "#fff"} opacity={i === 1 ? 1 : 0.5} />)}
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              {["Picked up", "In transit", "Out for delivery", "Delivered"].map((s, i) => (
                <div key={s} className="flex items-center gap-2 rounded-lg border border-white/[0.06] p-2.5">
                  <span className={cn("size-2.5 rounded-full", i < 2 ? "bg-[var(--pa)]" : "bg-white/15")} />
                  <span className="flex flex-1 flex-col gap-1"><Bar w="60%" /><Bar w="35%" className="opacity-50" /></span>
                </div>
              ))}
              <div className="mt-auto grid grid-cols-2 gap-2"><Stat accent /><Stat /></div>
            </div>
          </div>
        </>
      );
    default:
      return (
        <>
          <Side />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="grid grid-cols-3 gap-2"><Stat accent /><Stat /><Stat /></div>
            <div className="flex-1 rounded-lg border border-white/[0.06] p-3"><Chart /></div>
          </div>
        </>
      );
  }
}
