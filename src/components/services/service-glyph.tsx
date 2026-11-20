import { IsoBlock, IsoScene } from "@/components/ui/iso-block";
import { serviceLook } from "@/config/blocks";
import { cn } from "@/lib/utils/cn";

/** A service's CSS-3D block icon in its clay colour, with its short name on the top face. */
export function ServiceGlyph({ icon, size = 64, label = true, className }: { icon: string; size?: number; label?: boolean; className?: string }) {
  const look = serviceLook(icon);
  return (
    <IsoScene width={size} height={size} box={{ w: size * 1.45, h: size * 1.15 }} className={cn("shrink-0", className)} sceneClassName="iso-hover">
      <IsoBlock x={0} y={0} w={size} d={size} h={Math.max(5, size * 0.26)} color={look.color} title={label && size >= 48 ? look.short : undefined} lines={label && size >= 48 ? 2 : 0} />
    </IsoScene>
  );
}
