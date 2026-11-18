import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/data/content";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectVisual } from "@/components/projects/project-visual";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { pad2 } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

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
        eyebrow="Selected work"
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        title={["Software that", { text: "runs businesses.", serif: true, gradient: true }]}
        description="Platforms and systems we've designed and engineered for real businesses — from customer communication and workforce operations to commerce and enterprise software."
      />
      <section aria-label="Projects" className="container-x pb-[var(--section-y)]">
        <ul className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 2) * 0.1} className={cn(i % 2 === 1 && "md:mt-32")}>
              <Link href={`/work/${p.slug}`} data-cursor-label="View" className="group block">
                <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line">
                  <ProjectVisual
                    project={p}
                    priority={i < 2}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[4/3] transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="eyebrow mb-3" style={{ color: p.accent }}>
                      {pad2(i + 1)} — {p.category}
                    </p>
                    <h2 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{p.title}</h2>
                    <p className="mt-3 max-w-md leading-relaxed text-fg-2">{p.summary}</p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:bg-fg group-hover:text-bg">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-28 flex flex-col items-center gap-6 text-center">
          <p className="display text-[clamp(2rem,4vw,3.5rem)]">
            Have something similar in mind<span className="accent-serif text-accent">?</span>
          </p>
          <ButtonLink href="/#contact" size="lg">
            Discuss Your Idea
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
