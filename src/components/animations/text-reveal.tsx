"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Segment of a heading. Plain strings are split into words; `{ text, hl: true }` puts the
 * phrase under the lime highlighter, which draws left → right after the words have risen.
 * On pine surfaces (`.on-pine`) the highlighted phrase turns lime instead.
 */
export type TextSegment = string | { text: string; hl?: boolean; className?: string };

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

const ease = [0.16, 1, 0.3, 1] as const;

/** Word-by-word rise (18px + fade). Screen readers get the full sentence via aria-label. */
export function TextReveal({ segments, as = "h2", className, delay = 0, stagger = 0.05, immediate = false, id }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.h2;
  const label = segments.map((s) => (typeof s === "string" ? s : s.text)).join(" ");

  let index = 0;
  const groups = segments.map((seg, si) => {
    const opts: Exclude<TextSegment, string> = typeof seg === "string" ? { text: seg } : seg;
    const words = opts.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word, wi) => ({ key: `${si}-${wi}`, word, i: index++ }));
    return { key: si, opts, words };
  });
  const lastWord = Math.max(0, index - 1);
  const drawAt = delay + lastWord * stagger + 0.3;

  const viewProps = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } };

  const renderWords = (words: { key: string; word: string; i: number }[], extra?: string, trimEnd = false) =>
    words.map(({ key, word, i }, wi) => (
      <Fragment key={key}>
        <motion.span
          aria-hidden
          className={cn("inline-block will-change-transform", extra)}
          variants={{
            hidden: { y: reduce ? 0 : 18, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.8, delay: delay + i * stagger, ease } },
          }}
        >
          {word}
        </motion.span>
        {trimEnd && wi === words.length - 1 ? null : " "}
      </Fragment>
    ));

  return (
    <Tag id={id} aria-label={label} className={className} {...viewProps}>
      {groups.map(({ key, opts, words }) =>
        opts.hl ? (
          <Fragment key={key}>
            <motion.span
              aria-hidden
              className={cn("hl", opts.className)}
              variants={{
                hidden: { backgroundSize: reduce ? "100% 0.36em" : "0% 0.36em" },
                show: { backgroundSize: "100% 0.36em", transition: { duration: 0.7, delay: drawAt, ease } },
              }}
            >
              {renderWords(words, undefined, true)}
            </motion.span>{" "}
          </Fragment>
        ) : (
          <Fragment key={key}>{renderWords(words, opts.className)}</Fragment>
        ),
      )}
    </Tag>
  );
}
