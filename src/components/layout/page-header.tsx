import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { TextReveal, type TextSegment } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";

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
    <header className="relative overflow-hidden pt-40 pb-16 sm:pt-48 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_70%_at_30%_0%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[640px] rounded-full bg-accent/15 blur-[120px]" />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-3">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg-2">
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <ChevronRight className="size-3.5" aria-hidden />}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mb-6">{eyebrow}</p>
        <TextReveal as="h1" immediate segments={title} className="display max-w-5xl text-[clamp(2.8rem,7.5vw,7rem)] text-balance" />
        {description && (
          <Reveal delay={0.3} className="mt-8 max-w-2xl text-[1.1rem] leading-relaxed text-fg-2">
            {description}
          </Reveal>
        )}
        {children}
      </div>
    </header>
  );
}
