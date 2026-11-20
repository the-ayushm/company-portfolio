import type { ReactNode } from "react";
import { TextReveal, type TextSegment } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils/cn";

type Props = {
  index: string;
  eyebrow: string;
  title: TextSegment[];
  description?: ReactNode;
  /** "split" = heading in cols 1–7 with the index label right; "left" = single stacked column. */
  align?: "left" | "split";
  className?: string;
  titleClassName?: string;
  id?: string;
};

export function IndexLabel({ index, eyebrow, className }: { index: string; eyebrow: string; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-lime ring-1 ring-lime-deep/50" />
      {index} / {eyebrow}
    </span>
  );
}

export function SectionHeading({ index, eyebrow, title, description, align = "split", className, titleClassName, id }: Props) {
  const split = align === "split";
  return (
    <div className={cn("grid gap-5", split && "lg:grid-cols-12 lg:gap-x-8", className)}>
      <Reveal y={10} className={cn(split && "lg:order-2 lg:col-span-5 lg:col-start-8 lg:flex lg:justify-end lg:pt-4")}>
        <IndexLabel index={index} eyebrow={eyebrow} />
      </Reveal>
      <div className={cn(split && "lg:order-1 lg:col-span-7 lg:row-start-1")}>
        <TextReveal id={id} segments={title} className={cn("h-section text-balance", titleClassName)} />
        {description && (
          <Reveal delay={0.15} className="lead mt-6 max-w-xl">
            {description}
          </Reveal>
        )}
      </div>
    </div>
  );
}
