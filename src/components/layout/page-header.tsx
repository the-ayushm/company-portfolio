import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { TextReveal, type TextSegment } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { IsoBlock, IsoScene, type ClayName } from "@/components/ui/iso-block";

const cluster: { x: number; y: number; s: number; h: number; color: ClayName }[] = [
  { x: 0, y: 0, s: 70, h: 12, color: "sage" },
  { x: 82, y: 0, s: 70, h: 22, color: "lilac" },
  { x: 0, y: 82, s: 70, h: 8, color: "apricot" },
  { x: 82, y: 82, s: 84, h: 30, color: "lime" },
];

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: TextSegment[];
  description?: ReactNode;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-20">
      <div className="container-x relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-2">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-pine">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-pine">
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 && <ChevronRight className="size-3.5" aria-hidden />}
                </li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow mb-5 inline-flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-lime ring-1 ring-lime-deep/50" />
            {eyebrow}
          </p>
          <TextReveal as="h1" immediate segments={title} className="display max-w-4xl text-[clamp(2.6rem,5.6vw,5.4rem)] text-balance" />
          {description && (
            <Reveal delay={0.3} className="lead mt-7 max-w-2xl">
              {description}
            </Reveal>
          )}
          {children}
        </div>
        <div className="relative hidden lg:col-span-4 lg:block">
          <IsoScene width={170} height={170} className="absolute inset-0">
            {cluster.map((b, i) => (
              <IsoBlock key={i} x={b.x} y={b.y} w={b.s} d={b.s} h={b.h} color={b.color} float phase={i * 0.8} />
            ))}
          </IsoScene>
        </div>
      </div>
    </header>
  );
}
