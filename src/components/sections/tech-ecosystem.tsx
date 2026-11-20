import { techGroups, techStack } from "@/config/tech";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";

export function TechEcosystem() {
  return (
    <section id="technology" aria-labelledby="tech-title" className="section-y relative bg-bg-2">
      <div className="container-x">
        <SectionHeading
          id="tech-title"
          index="06"
          eyebrow="Technology"
          title={["Proven tools,", { text: "modern stack.", hl: true }]}
          description="The tools we work with day to day. Each project uses the subset that fits its requirements — not every technology on every project."
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {techGroups.map((g, gi) => (
            <Reveal key={g} delay={gi * 0.08}>
              <h3 className="eyebrow mb-5">{g}</h3>
              <ul className="flex flex-wrap gap-x-3 gap-y-4">
                {techStack
                  .filter((t) => t.group === g)
                  .map((t) => (
                    <li key={t.name} className="keycap flex cursor-default select-none items-center gap-2.5 px-4 py-3 text-[15px] text-pine">
                      <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: t.color }} />
                      {t.name}
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
