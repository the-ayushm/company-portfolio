import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/data/content";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectVisual } from "@/components/projects/project-visual";
import { TiltCard } from "@/components/animations/tilt-card";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { pad2 } from "@/lib/utils/format";

export const metadata = pageMetadata({
  title: "Our Work",
  description: "Selected software projects: WhatsApp Business CRM, event workforce management, Ayurvedic e-commerce, ERP, Shopify and logistics CRM solutions.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <PageHeader
        eyebrow="Case studies"
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        title={["Real systems,", { text: "running today.", hl: true }]}
        description="Platforms and systems we've designed and built for real businesses — from customer communication and workforce operations to commerce and enterprise software."
      />
      <section aria-label="Projects" className="container-x pb-[var(--section-y)]">
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 2) * 0.08}>
              <TiltCard max={3} className="rounded-[var(--radius-lg)]">
                <Link href={`/work/${p.slug}`} className="group card flex h-full flex-col p-3 transition-shadow duration-500 hover:shadow-[var(--shadow-card-hover)]">
                  <ProjectVisual project={p} priority={i < 2} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3]" />
                  <div className="flex flex-1 items-start justify-between gap-6 p-5 sm:p-6">
                    <div>
                      <p className="eyebrow mb-3">
                        {pad2(i + 1)} · {p.category}
                      </p>
                      <h2 className="h-card text-[clamp(1.5rem,2.4vw,2rem)] text-pine">{p.title}</h2>
                      <p className="mt-3 max-w-md font-light leading-relaxed text-fg-2">{p.summary}</p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-pine transition-transform duration-500 ease-[var(--ease-snap)] group-hover:rotate-45">
                      <ArrowUpRight className="size-5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
        <div className="pine-panel on-pine mt-16 flex flex-col items-start gap-8 p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="h-section max-w-2xl text-balance text-porcelain">
            Have something <span className="hl">similar in mind?</span>
          </h2>
          <ButtonLink href="/#contact" size="lg" variant="lime">
            Discuss your idea
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
