import Image from "next/image";
import { IsoBlock, IsoScene } from "@/components/ui/iso-block";
import { modulesFor } from "@/config/blocks";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import type { ProjectContent } from "@/types/content";

const B = 86; // module footprint (px)
const G = 14; // gap
const CORE = 112;

/**
 * Project imagery. Shows the real cover screenshot when one has been uploaded; otherwise a mini
 * pine panel with the project's modules as CSS-3D blocks snapped to the lime core — an illustration
 * of the system, never presented as a screenshot.
 */
export function ProjectVisual({
  project,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 55vw, 100vw",
  rounded = true,
}: {
  project: Pick<ProjectContent, "title" | "visual" | "coverImage">;
  className?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: boolean;
}) {
  if (project.coverImage) {
    return (
      <div className={cn("relative overflow-hidden bg-bg-2", rounded && "rounded-[22px]", className)}>
        <Image src={project.coverImage} alt={`${project.title} — screenshot`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    );
  }
  return (
    <div
      className={cn("pine-panel on-pine", rounded ? "rounded-[22px]" : "rounded-none", className)}
      role="img"
      aria-label={`Illustration of the ${project.title} system: ${modulesFor(project.visual)
        .map((m) => m.title)
        .join(", ")} connected to one core`}
    >
      <ProjectBlocks visual={project.visual} />
      <span className="absolute bottom-3 right-4 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-porcelain/45">Illustration</span>
    </div>
  );
}

export function ProjectBlocks({ visual, className }: { visual: string; className?: string }) {
  const mods = modulesFor(visual).slice(0, 4);
  const pos = [
    [0, 0],
    [0, B + G],
    [B + G, 0],
    [B + G, B + G],
  ] as const;
  const coreX = 2 * (B + G) + 4;
  const coreY = (2 * B + G - CORE) / 2;
  const planeW = coreX + CORE;
  const planeH = 2 * B + G;
  return (
    <div className={cn("absolute inset-0 grid place-items-center", className)}>
      <div className="scale-[0.8] sm:scale-105 lg:scale-[1.3]">
        <IsoScene width={planeW} height={planeH} sceneClassName="iso-hover">
          {/* lime wires on the floor */}
          <span aria-hidden className="absolute h-[2px] rounded-full bg-lime shadow-[0_0_8px_#C6F432]" style={{ left: B / 2, top: B / 2, width: coreX - B / 2 + 10 }} />
          <span aria-hidden className="absolute h-[2px] rounded-full bg-lime shadow-[0_0_8px_#C6F432]" style={{ left: B / 2, top: B + G + B / 2, width: coreX - B / 2 + 10 }} />
          <span aria-hidden className="absolute h-[2px] rounded-full bg-lime/30" style={{ left: coreX + CORE, top: planeH / 2, width: 220 }} />
          {mods.map((m, i) => (
            <IsoBlock key={m.title} x={pos[i]![0]} y={pos[i]![1]} w={B} d={B} h={[12, 20, 8, 16][i]!} color={m.color} label={m.label} title={m.title} lines={i % 2 === 0 ? 2 : 0} float phase={i * 0.9} />
          ))}
          <IsoBlock x={coreX} y={coreY} w={CORE} d={CORE} h={34} color="lime" label={`${siteConfig.brand.wordmark.toUpperCase()} CORE`} title="Automated" float phase={2.4}>
            <span className="absolute left-[14%] top-[34%] flex items-end gap-[4px]">
              {[10, 16, 22, 30].map((hgt) => (
                <span key={hgt} className="block w-[9px] rounded-[2px] bg-pine" style={{ height: hgt }} />
              ))}
            </span>
          </IsoBlock>
        </IsoScene>
      </div>
    </div>
  );
}
