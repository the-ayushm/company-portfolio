"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Network, PenTool, Code2, ShieldCheck, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { title: "Discovery & Planning", text: "Understand the business, requirements, and objectives.", Icon: Compass },
  { title: "Architecture & Strategy", text: "Plan the technical architecture, database, and system workflows.", Icon: Network },
  { title: "UI/UX Design", text: "Create intuitive and visually engaging user experiences.", Icon: PenTool },
  { title: "Development", text: "Build the frontend, backend, APIs, and integrations.", Icon: Code2 },
  { title: "Testing & Quality Assurance", text: "Test functionality, performance, reliability, and security.", Icon: ShieldCheck },
  { title: "Deployment & Support", text: "Deploy the solution and provide ongoing maintenance when agreed.", Icon: Rocket },
];

export function ProcessSection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // Desktop: pin and scroll the timeline horizontally.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - el.clientWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => progress.current && (progress.current.style.transform = `scaleX(${st.progress})`),
          },
        });
        // Cards rise in (staggered) as the section approaches; the pinned scrub then moves the track.
        gsap.from("[data-step]", {
          y: 60,
          opacity: 0,
          stagger: 0.09,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section.current, start: "top 75%", once: true },
        });
        return () => tween.scrollTrigger?.kill();
      });
      // Mobile / tablet: vertical timeline with a growing line.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((card) => {
          gsap.from(card, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" } });
        });
        gsap.fromTo(
          "[data-vline]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: track.current, start: "top 70%", end: "bottom 70%", scrub: true } },
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="process" aria-labelledby="process-title" className="relative overflow-hidden py-[var(--section-y)] lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-16">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          index="03"
          eyebrow="How we work"
          title={["From Idea to Production.", { text: "We Build It Together.", serif: true }]}
          description="A clear, collaborative process — so you always know what's being built, why, and what comes next."
          titleClassName="lg:text-[clamp(2.5rem,5vw,4.6rem)]"
        />
      </div>

      <div className="container-x relative mt-14 lg:mt-16">
        <div aria-hidden className="absolute left-[calc(var(--gutter)+19px)] top-0 h-full w-px bg-line lg:hidden">
          <div data-vline className="h-full w-full origin-top bg-gradient-to-b from-accent to-accent-2" />
        </div>
        <ol ref={track} className="relative flex flex-col gap-6 lg:flex-row lg:gap-6 lg:will-change-transform">
          {steps.map(({ title, text, Icon }, i) => (
            <li key={title} data-step className="relative pl-14 lg:w-[min(30vw,420px)] lg:shrink-0 lg:pl-0">
              <span className="absolute left-0 top-6 grid size-10 place-items-center rounded-full border border-line-strong bg-bg font-mono text-xs text-accent lg:hidden">
                {String(i + 1).padStart(2, "0")}
              </span>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card p-7 transition-colors duration-500 hover:border-line-strong lg:min-h-[340px] lg:p-9">
                <span aria-hidden className="absolute -right-4 -top-10 font-mono text-[9rem] font-light leading-none text-white/[0.03] transition-colors duration-700 group-hover:text-accent/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span data-step-anim className="mb-auto grid size-12 place-items-center rounded-2xl border border-line bg-white/[0.03] text-fg transition-colors duration-500 group-hover:border-accent/50 group-hover:text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p data-step-anim className="mt-10 hidden font-mono text-xs text-accent lg:block">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 data-step-anim className="mt-3 text-2xl font-medium tracking-[-0.03em]">
                  {title}
                </h3>
                <p data-step-anim className="mt-3 leading-relaxed text-fg-2">
                  {text}
                </p>
              </article>
            </li>
          ))}
        </ol>
        <div aria-hidden className="mt-10 hidden h-px w-full bg-line lg:block">
          <div ref={progress} className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2" />
        </div>
      </div>
    </section>
  );
}
