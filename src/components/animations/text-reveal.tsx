"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Segment of a heading. Plain strings are split into words; `{ text, serif: true }`
 * renders the words in the italic serif accent face; `{ text, gradient: true }` adds the brand gradient.
 */
export type TextSegment = string | { text: string; serif?: boolean; gradient?: boolean; className?: string };

type Props = {
  segments: TextSegment[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  id?: string;
};

/** Word-by-word masked rise. Screen readers get the full sentence via aria-label. */
export function TextReveal({ segments, as = "h2", className, delay = 0, stagger = 0.045, immediate = false, id }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.h2;
  const label = segments.map((s) => (typeof s === "string" ? s : s.text)).join(" ");

  let index = 0;
  const words = segments.flatMap((seg, si) => {
    const text = typeof seg === "string" ? seg : seg.text;
    const opts: Exclude<TextSegment, string> = typeof seg === "string" ? { text } : seg;
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word, wi) => ({ key: `${si}-${wi}`, word, opts, i: index++ }));
  });

  const viewProps = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } };

  return (
    <Tag id={id} aria-label={label} className={className} {...viewProps}>
      {words.map(({ key, word, opts, i }) => (
        <Fragment key={key}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={cn(
                "inline-block will-change-transform",
                opts.serif && "accent-serif",
                opts.gradient && "text-gradient",
                opts.className,
              )}
              variants={{
                hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 1, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
            </motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}
