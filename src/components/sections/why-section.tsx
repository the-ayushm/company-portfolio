import { Briefcase, Puzzle, Layers, Cpu, MessagesSquare, Users, LifeBuoy } from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { SpotlightCard } from "@/components/sections/spotlight-card";
import { cn } from "@/lib/utils/cn";

type Item = { title: string; text: string; Icon: typeof Briefcase; span: string; visual?: ReactNode };

const LayersVisual = (
  <div aria-hidden className="relative mt-6 h-24 [perspective:600px]">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="absolute inset-x-6 h-12 rounded-xl border border-line-strong bg-white/[0.03] transition-transform duration-700 ease-[var(--ease-out)] [transform:rotateX(55deg)] group-hover:[transform:rotateX(55deg)_translateZ(var(--z))]"
        style={{ top: `${i * 18}px`, ["--z" as string]: `${(2 - i) * 22}px`, borderColor: i === 0 ? "var(--accent)" : undefined }}
      />
    ))}
  </div>
);

const ChatVisual = (
  <div aria-hidden className="mt-6 flex flex-col gap-2 text-xs">
    {["Sprint review shared", "Staging build ready for feedback", "Next milestone: integrations"].map((t, i) => (
      <span
        key={t}
        className={cn(
          "w-fit rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-fg-2 transition-all duration-500 ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:opacity-100",
          i > 0 && "translate-x-3 opacity-50",
        )}
        style={{ transitionDelay: `${i * 90}ms` }}
      >
        <span className="mr-2 inline-block size-1.5 rounded-full bg-success align-middle" />
        {t}
      </span>
    ))}
  </div>
);

const TeamVisual = (
  <div aria-hidden className="mt-6 flex items-center">
    {["A", "P", "R"].map((l, i) => (
      <span
        key={l}
        className="-ml-3 grid size-14 place-items-center rounded-full border border-line-strong bg-card-2 text-lg font-medium first:ml-0 transition-[margin] duration-500 ease-[var(--ease-out)] group-hover:-ml-1 group-hover:first:ml-0"
        style={{ boxShadow: `0 0 0 4px var(--card)`, color: ["var(--fg)", "var(--accent)", "var(--accent-2)"][i] }}
      >
        {l}
      </span>
    ))}
    <span className="ml-4 h-px flex-1 bg-gradient-to-r from-accent to-transparent" />
    <span className="eyebrow ml-3">One system</span>
  </div>
);

const items: Item[] = [
  {
    title: "Business-focused engineering",
    text: "We start from your goals, workflows and constraints — then choose the technology. Every feature should earn its place by solving a real business problem.",
    Icon: Briefcase,
    span: "lg:col-span-7",
    visual: (
      <div aria-hidden className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-xs">
        <div className="flex flex-col gap-2">
          {["Manual follow-ups", "Scattered data", "Slow reporting"].map((t) => (
            <span key={t} className="rounded-lg border border-dashed border-line-strong px-3 py-2 text-fg-3">{t}</span>
          ))}
        </div>
        <span className="font-mono text-accent transition-transform duration-500 group-hover:translate-x-1">→</span>
        <div className="flex flex-col gap-2">
          {["Automated workflows", "One source of truth", "Live dashboards"].map((t) => (
            <span key={t} className="rounded-lg border border-line bg-accent/[0.08] px-3 py-2 text-fg transition-colors duration-500 group-hover:border-accent/40">{t}</span>
          ))}
        </div>
      </div>
    ),
  },
  { title: "Custom-built solutions", text: "No forcing your business into a template. We build around the way your team actually works.", Icon: Puzzle, span: "lg:col-span-5" },
  { title: "Scalable architecture", text: "Clean modular codebases, well-modelled databases and APIs designed to grow with you.", Icon: Layers, span: "lg:col-span-4", visual: LayersVisual },
  { title: "Modern technology stack", text: "TypeScript, Next.js, Node.js, PostgreSQL — proven, maintainable tools with large ecosystems.", Icon: Cpu, span: "lg:col-span-4" },
  { title: "Transparent communication", text: "Regular updates, visible progress and honest conversations about scope and trade-offs.", Icon: MessagesSquare, span: "lg:col-span-4", visual: ChatVisual },
  { title: "Collaborative development", text: "Three engineers working as one team, with you involved at every milestone.", Icon: Users, span: "lg:col-span-6", visual: TeamVisual },
  { title: "Long-term technical support", text: "Maintenance, improvements and new features after launch — when you need a partner, not a hand-off.", Icon: LifeBuoy, span: "lg:col-span-6" },
];

export function WhySection() {
  return (
    <section id="why" aria-labelledby="why-title" className="section-y relative bg-bg-2/40">
      <div className="container-x">
        <SectionHeading
          id="why-title"
          index="05"
          eyebrow="Why work with us"
          title={["More Than Developers.", { text: "Your Technology Partners.", serif: true }]}
        />
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {items.map(({ title, text, Icon, span, visual }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 0.08} className={cn(span, i === 0 && "sm:col-span-2")}>
              <SpotlightCard className="flex h-full flex-col p-7 sm:p-8">
                <div className="relative flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="relative mt-8 text-xl font-medium tracking-[-0.03em] sm:text-2xl">{title}</h3>
                <p className="relative mt-3 max-w-xl leading-relaxed text-fg-2">{text}</p>
                {visual && <div className="relative mt-auto">{visual}</div>}
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
