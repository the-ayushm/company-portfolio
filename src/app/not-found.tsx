import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { IsoBlock, IsoScene } from "@/components/ui/iso-block";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="container-x flex h-[76px] items-center">
        <Logo />
      </div>
      <div className="container-x grid flex-1 items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-5">Error 404</p>
          <h1 className="display text-[clamp(2.6rem,6vw,5.4rem)] text-balance">
            This block <span className="hl">doesn&apos;t exist.</span>
          </h1>
          <p className="lead mt-6 max-w-md">The page you&apos;re looking for has moved, or never snapped into place.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="group inline-flex h-[60px] items-center gap-3 rounded-full bg-pine pl-7 pr-4 font-medium text-porcelain transition-colors hover:bg-pine-2"
            >
              Back home
              <span className="grid size-[26px] place-items-center rounded-full bg-lime text-pine transition-transform duration-300 ease-[var(--ease-snap)] group-hover:translate-x-1">
                <ArrowRight className="size-3.5" strokeWidth={2.4} aria-hidden />
              </span>
            </Link>
            <Link href="/work" className="inline-flex h-[60px] items-center rounded-full border-[1.5px] border-pine px-7 font-medium text-pine transition-colors hover:bg-pine hover:text-porcelain">
              View our work
            </Link>
          </div>
        </div>
        <div className="pine-panel on-pine relative aspect-square w-full max-w-[520px] justify-self-center">
          <p className="absolute left-7 top-6 font-mono text-[11px] uppercase tracking-[0.08em] text-porcelain/60">
            System view · <span className="text-lime">0 blocks found</span>
          </p>
          <IsoScene width={170} height={170} className="absolute inset-0">
            <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateZ(18deg)_rotateX(-10deg)]">
              <IsoBlock x={0} y={0} w={170} d={170} h={34} color="apricot" label="404 · LOST" title="Missing" lines={2} float />
            </div>
          </IsoScene>
        </div>
      </div>
    </main>
  );
}
