import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { MiniBlock, type ClayName } from "@/components/ui/iso-block";
import { cn } from "@/lib/utils/cn";

type Item = { title: string; lead: string; key: string; color: ClayName; dark?: boolean };

const items: Item[] = [
  {
    title: "Built around your business",
    lead: "We start from your goals, workflows and constraints — then choose the technology.",
    key: "No forcing your team into a template.",
    color: "sage",
  },
  {
    title: "Systems that scale",
    lead: "Clean modular code, well-modelled databases and APIs on a modern TypeScript, Next.js, Node.js and PostgreSQL stack —",
    key: "built to grow with you.",
    color: "lilac",
  },
  {
    title: "You're never in the dark",
    lead: "Regular demos, visible progress and honest conversations about scope and trade-offs —",
    key: "no surprises at launch.",
    color: "apricot",
  },
  {
    title: "Support after launch",
    lead: "Maintenance, improvements and new features when you need them —",
    key: "a partner, not a hand-off.",
    color: "lime",
    dark: true,
  },
];

export function WhySection() {
  return (
    <section id="why" aria-labelledby="why-title" className="section-y relative bg-bg-2">
      <div className="container-x">
        <SectionHeading
          id="why-title"
          index="04"
          eyebrow="Why us"
          title={["More than developers.", { text: "Your technology partner.", hl: true }]}
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.08}>
              <article
                className={cn(
                  "group card-hover flex h-full flex-col rounded-[var(--radius-lg)] p-7",
                  it.dark ? "pine-panel on-pine shadow-[var(--shadow-card)]" : "card",
                )}
              >
                <div className="flex items-start justify-between">
                  <MiniBlock color={it.color} size={34} />
                  <span className={cn("font-mono text-xs", it.dark ? "text-porcelain/55" : "text-fg-3")}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className={cn("mt-10 text-[1.35rem] font-medium tracking-[-0.03em]", it.dark ? "text-porcelain" : "text-pine")}>{it.title}</h3>
                <p className={cn("mt-3 font-light leading-relaxed", it.dark ? "text-porcelain/75" : "text-fg-2")}>
                  {it.lead} <span className={cn("font-medium", it.dark ? "text-lime" : "text-pine")}>{it.key}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
