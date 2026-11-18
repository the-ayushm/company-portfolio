import type { ReactNode } from "react";
import { TextReveal, type TextSegment } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils/cn";

type Props = {
  index: string;
  eyebrow: string;
  title: TextSegment[];
  description?: ReactNode;
  align?: "left" | "split";
  className?: string;
  titleClassName?: string;
  id?: string;
};

/** Editorial section header: numbered eyebrow, large display title, optional lede. */
export function SectionHeading({ index, eyebrow, title, description, align = "split", className, titleClassName, id }: Props) {
  return (
    <div
      className={cn(
        "grid gap-8",
        align === "split" && "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16",
        className,
      )}
    >
      <div>
        <Reveal className="mb-6 flex items-center gap-3" y={12}>
          <span className="font-mono text-xs text-accent">{index}</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden />
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <TextReveal
          id={id}
          segments={title}
          className={cn("display text-[clamp(2.5rem,6.2vw,5.6rem)] text-balance", titleClassName)}
        />
      </div>
      {description && (
        <Reveal delay={0.15} className="max-w-md text-[1.05rem] leading-relaxed text-fg-2 lg:pb-3">
          {description}
        </Reveal>
      )}
    </div>
  );
}
