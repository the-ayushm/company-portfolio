import Image from "next/image";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/ui/brand-icons";
import { getTeam } from "@/lib/data/content";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { PlaceholderChip } from "@/components/ui/placeholder-chip";
import { cn } from "@/lib/utils/cn";
import type { TeamMemberContent } from "@/types/content";

const portraitHues = [
  ["#6d7cff", "#a77bff"],
  ["#7ee8fa", "#6d7cff"],
  ["#a77bff", "#ff8fb1"],
];

function Portrait({ member, index }: { member: TeamMemberContent; index: number }) {
  if (member.photoUrl) {
    return (
      <Image
        src={member.photoUrl}
        alt={`Portrait of ${member.name}`}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
      />
    );
  }
  const [a, b] = portraitHues[index % portraitHues.length]!;
  return (
    <div className="absolute inset-0 overflow-hidden" role="img" aria-label={`Photo placeholder for ${member.name}`}>
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-110"
        style={{
          background: `radial-gradient(120% 80% at 20% 0%, ${a}55, transparent 55%), radial-gradient(90% 70% at 100% 100%, ${b}40, transparent 60%), #0e1018`,
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <span className="accent-serif absolute -bottom-[0.18em] right-4 text-[11rem] leading-none text-white/[0.09] transition-transform duration-1000 ease-[var(--ease-out)] group-hover:-translate-y-3">
        {member.name.charAt(0)}
      </span>
      {siteConfig.showContentPlaceholders && (
        <PlaceholderChip label="Photo coming soon" className="absolute left-4 top-4" />
      )}
    </div>
  );
}

export async function TeamSection() {
  const team = await getTeam();
  const showPh = siteConfig.showContentPlaceholders;

  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About our team"
          title={["Three Minds.", { text: "One Engineering", serif: true }, "Vision."]}
          description="We are a collaborative team of developers focused on building practical, scalable and reliable digital solutions. From business automation to custom software platforms, we turn complex requirements into products that help businesses operate better."
        />

        <ul className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {team.map((m, i) => (
            <Reveal as="li" key={m.slug} delay={i * 0.12} className={cn(i === 1 && "lg:translate-y-16", i === 2 && "sm:col-span-2 lg:col-span-1")}>
              <TiltCard className="rounded-[var(--radius-lg)]">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card">
                  <div className="relative aspect-[4/4.4] overflow-hidden sm:aspect-[4/4.6]">
                    <Portrait member={m} index={i} />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
                    <span className="absolute right-4 top-4 font-mono text-xs text-fg-2">0{i + 1}</span>
                  </div>
                  <div className="relative flex flex-1 flex-col gap-4 p-6 pt-0 sm:p-7 sm:pt-0">
                    <div>
                      <h3 className="text-3xl font-medium tracking-[-0.04em]">{m.name}</h3>
                      <div className="mt-2">
                        {m.role ? (
                          <p className="eyebrow text-accent">{m.role}</p>
                        ) : (
                          showPh && <PlaceholderChip label="Role to be confirmed" />
                        )}
                      </div>
                    </div>
                    {m.bio ? (
                      <p className="text-[0.95rem] leading-relaxed text-fg-2">{m.bio}</p>
                    ) : (
                      showPh && <p className="text-sm italic text-fg-3">Short professional introduction — to be added.</p>
                    )}
                    {m.skills.length > 0 ? (
                      <ul className="flex flex-wrap gap-1.5" aria-label={`${m.name}'s skills`}>
                        {m.skills.map((s) => (
                          <li key={s} className="rounded-full border border-line px-2.5 py-1 text-xs text-fg-2">
                            {s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      showPh && <PlaceholderChip label="Skills to be added" className="self-start" />
                    )}
                    <div className="mt-auto flex gap-2 border-t border-line pt-5">
                      {m.linkedinUrl && (
                        <a
                          href={m.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name} on LinkedIn`}
                          className="grid size-10 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors hover:border-fg/40 hover:text-fg"
                        >
                          <Linkedin className="size-4" aria-hidden />
                        </a>
                      )}
                      {m.githubUrl && (
                        <a
                          href={m.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name} on GitHub`}
                          className="grid size-10 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors hover:border-fg/40 hover:text-fg"
                        >
                          <Github className="size-4" aria-hidden />
                        </a>
                      )}
                      {!m.linkedinUrl && !m.githubUrl && showPh && <PlaceholderChip label="Profile links to be added" />}
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
