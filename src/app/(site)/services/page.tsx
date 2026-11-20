import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects, getServices } from "@/lib/data/content";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceGlyph } from "@/components/services/service-glyph";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, JsonLd } from "@/lib/seo/json-ld";
import { pad2 } from "@/lib/utils/format";

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
        title={["Every block of your business,", { text: "built to fit.", hl: true }]}
        description="From discovery to deployment and long-term support — here's what we build and how it helps."
      />
      <section aria-label="All services" className="container-x pb-[var(--section-y)]">
        <ol className="flex flex-col gap-4">
          {services.map((s, i) => {
            const work = projects.filter((p) => p.serviceSlugs.includes(s.slug));
            return (
              <li key={s.slug} id={s.slug} className="scroll-mt-28">
                <Reveal className="group card grid gap-8 p-7 sm:p-10 lg:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
                  <div className="flex items-start gap-5 lg:flex-col">
                    <span className="font-mono text-xs text-fg-3">{pad2(i + 1)}</span>
                    <ServiceGlyph icon={s.icon} size={92} />
                  </div>
                  <div>
                    <h2 className="h-section text-[clamp(1.8rem,3vw,2.6rem)]">{s.title}</h2>
                    <p className="mt-5 max-w-xl text-[1.05rem] font-light leading-relaxed text-fg-2">{s.description ?? s.shortDescription}</p>
                    <div className="mt-7">
                      <ButtonLink href="/#contact">Discuss this</ButtonLink>
                    </div>
                  </div>
                  <div className="flex flex-col gap-7">
                    {s.technologies.length > 0 && (
                      <div>
                        <p className="eyebrow mb-3">Typical tools</p>
                        <ul className="flex flex-wrap gap-2">
                          {s.technologies.map((t) => (
                            <li key={t} className="chip">
                              {t}
                            </li>
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
                              <Link href={`/work/${p.slug}`} className="group/l inline-flex items-center gap-1.5 text-pine underline-offset-4 hover:underline">
                                {p.title} <span className="text-fg-2">— {p.category}</span>
                                <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" aria-hidden />
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
