import Link from "next/link";
import { getProjects, getServices } from "@/lib/data/content";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceGlyph } from "@/components/services/service-glyph";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { pad2 } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export const metadata = pageMetadata({
  title: "Services",
  description: "Custom software, ERP and CRM development, WhatsApp Business API automation, e-commerce and Shopify development, AI integration and backend API engineering.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHeader
        eyebrow="Services"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title={["Technology solutions", { text: "built around", serif: true, gradient: true }, "your business."]}
        description="From discovery to deployment and long-term support — here's what we build and how it helps."
      />
      <section aria-label="All services" className="container-x pb-[var(--section-y)]">
        <ol className="flex flex-col">
          {services.map((s, i) => {
            const work = projects.filter((p) => p.serviceSlugs.includes(s.slug));
            return (
              <li key={s.slug} id={s.slug} className="scroll-mt-28 border-t border-line py-16 last:border-b">
                <Reveal className={cn("grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16")}>
                  <span className="font-mono text-sm text-accent">{pad2(i + 1)}</span>
                  <div>
                    <h2 className="display text-[clamp(2rem,4vw,3.4rem)]">{s.title}</h2>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-2">{s.description ?? s.shortDescription}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <ButtonLink href="/#contact">Discuss Project</ButtonLink>
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <ServiceGlyph icon={s.icon} className="size-28" />
                    {s.technologies.length > 0 && (
                      <div>
                        <p className="eyebrow mb-3">Typical tools</p>
                        <ul className="flex flex-wrap gap-2">
                          {s.technologies.map((t) => (
                            <li key={t} className="rounded-full border border-line px-3 py-1.5 text-xs text-fg-2">{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {work.length > 0 && (
                      <div>
                        <p className="eyebrow mb-3">Related work</p>
                        <ul className="flex flex-col gap-2">
                          {work.map((p) => (
                            <li key={p.slug}>
                              <Link href={`/work/${p.slug}`} className="text-fg-2 underline-offset-4 transition-colors hover:text-fg hover:underline">
                                {p.title} — <span className="text-fg-3">{p.category}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
