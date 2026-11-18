import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjects, getServices } from "@/lib/data/content";
import { siteConfig } from "@/config/site";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ServiceGlyph } from "@/components/services/service-glyph";
import { TextReveal } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PlaceholderChip } from "@/components/ui/placeholder-chip";
import { breadcrumbLd, JsonLd, projectLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { pad2 } from "@/lib/utils/format";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return { title: "Project not found" };
  return pageMetadata({ title: `${p.title} — ${p.category}`, description: p.summary, path: `/work/${p.slug}` });
}

export default function ProjectPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectDetail params={props.params} />
    </Suspense>
  );
}

function ProjectSkeleton() {
  return (
    <div className="container-x pt-48 pb-32" aria-busy>
      <div className="h-4 w-40 animate-pulse rounded bg-white/5" />
      <div className="mt-8 h-24 w-3/4 animate-pulse rounded-2xl bg-white/5" />
      <div className="mt-16 aspect-[16/9] animate-pulse rounded-[var(--radius-lg)] bg-white/5" />
    </div>
  );
}

async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, projects, services] = await Promise.all([getProjectBySlug(slug), getProjects(), getServices()]);
  if (!project) notFound();
  const p = project;
  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];
  const related = services.filter((s) => p.serviceSlugs.includes(s.slug));
  const showPh = siteConfig.showContentPlaceholders;

  return (
    <article>
      <JsonLd data={projectLd(p)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: p.title, path: `/work/${p.slug}` }])} />

      {/* 1. Overview header */}
      <header className="relative overflow-hidden pt-36 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[720px] rounded-full blur-[140px]" style={{ background: `${p.accent}26` }} />
        <div className="container-x relative">
          <Link href="/work" className="group mb-10 inline-flex items-center gap-2 text-sm text-fg-2 transition-colors hover:text-fg">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> All work
          </Link>
          <p className="eyebrow mb-6" style={{ color: p.accent }}>
            {pad2(index + 1)} — {p.category}
          </p>
          <TextReveal as="h1" immediate segments={[p.title]} className="display text-[clamp(3rem,9vw,8.5rem)]" />
          <div className="mt-10 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Reveal delay={0.2}>
              <p className="max-w-2xl text-[clamp(1.1rem,1.6vw,1.35rem)] leading-relaxed text-fg-2">{p.overview ?? p.summary}</p>
            </Reveal>
            <Reveal delay={0.3} className="grid grid-cols-2 gap-6 text-sm">
              <Meta label="Category">{p.category}</Meta>
              <Meta label="Services">{related.map((s) => s.title).join(", ") || "—"}</Meta>
              <Meta label="Technology">
                {p.techStack.length ? p.techStack.join(", ") : showPh ? <PlaceholderChip label="Stack to be listed" /> : "—"}
              </Meta>
              {p.liveUrl && (
                <Meta label="Live">
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-accent">
                    Visit site <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </Meta>
              )}
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.35} y={60} className="container-x mt-16">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line">
            <ProjectVisual project={p} priority className="aspect-[16/10] sm:aspect-[16/8]" sizes="100vw" />
          </div>
        </Reveal>
      </header>

      <div className="container-x flex flex-col gap-28 py-28">
        {/* 2–3. Problem & solution */}
        {(p.problem || p.solution || showPh) && (
          <section aria-label="Problem and solution" className="grid gap-6 md:grid-cols-2">
            <Block index="01" title="The business problem" text={p.problem} showPh={showPh} />
            <Block index="02" title="Our solution" text={p.solution} showPh={showPh} accent={p.accent} />
          </section>
        )}

        {/* 4. Features */}
        <section aria-labelledby="features-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div>
            <p className="eyebrow mb-4">03</p>
            <h2 id="features-title" className="display text-[clamp(2rem,4vw,3.5rem)]">Key features</h2>
          </div>
          {p.features.length > 0 ? (
            <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
              {p.features.map((f, i) => (
                <Reveal as="li" key={f} delay={(i % 4) * 0.05} className="flex items-start gap-3 bg-card p-5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full" style={{ background: `${p.accent}26`, color: p.accent }}>
                    <Check className="size-3" aria-hidden />
                  </span>
                  <span className="text-fg-2">{f}</span>
                </Reveal>
              ))}
            </ul>
          ) : (
            showPh && <EmptyNote>Feature list to be added by the team.</EmptyNote>
          )}
        </section>

        {/* 5. Technology */}
        <section aria-labelledby="tech-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div>
            <p className="eyebrow mb-4">04</p>
            <h2 id="tech-title" className="display text-[clamp(2rem,4vw,3.5rem)]">Technology stack</h2>
          </div>
          {p.techStack.length > 0 ? (
            <ul className="flex flex-wrap content-start gap-3">
              {p.techStack.map((t) => (
                <li key={t} className="rounded-full border border-line-strong bg-white/[0.02] px-5 py-2.5">{t}</li>
              ))}
            </ul>
          ) : (
            showPh && <EmptyNote>Technologies used on this project will be listed once confirmed.</EmptyNote>
          )}
        </section>

        {/* 6. Gallery */}
        <section aria-labelledby="gallery-title">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">05</p>
              <h2 id="gallery-title" className="display text-[clamp(2rem,4vw,3.5rem)]">Screens</h2>
            </div>
          </div>
          {p.images.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2">
              {p.images.map((img, i) => (
                <Reveal as="li" key={img.url} delay={(i % 2) * 0.1} className={i % 3 === 0 ? "md:col-span-2" : ""}>
                  <figure>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card">
                      <Image src={img.url} alt={img.alt || `${p.title} screenshot ${i + 1}`} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover object-top" />
                    </div>
                    {img.caption && <figcaption className="mt-3 text-sm text-fg-3">{img.caption}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <ProjectVisual project={p} className="aspect-[16/10] rounded-[var(--radius-lg)] border border-line" />
              <div className="flex flex-col justify-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-line-strong p-8">
                {showPh && <PlaceholderChip label="Screenshots coming soon" className="self-start" />}
                <p className="leading-relaxed text-fg-2">
                  Real screenshots of this project will be published here. Want a walkthrough in the meantime? We can
                  demo the product on a call.
                </p>
                <ButtonLink href="/#contact" variant="ghost" className="self-start">
                  Request a demo
                </ButtonLink>
              </div>
            </div>
          )}
        </section>

        {/* 7–8. Contribution & results */}
        <section aria-label="Contribution and results" className="grid gap-6 md:grid-cols-2">
          <Block index="06" title="Our contribution" text={p.contribution} showPh={showPh} />
          {(p.results || showPh) && (
            <Block index="07" title="Results" text={p.results} showPh={showPh} placeholder="Only verified outcomes will be published here." />
          )}
        </section>

        {/* 9. Related services */}
        {related.length > 0 && (
          <section aria-labelledby="related-title">
            <p className="eyebrow mb-4">08</p>
            <h2 id="related-title" className="display mb-10 text-[clamp(2rem,4vw,3.5rem)]">Related services</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="group flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-card p-6 transition-colors hover:border-line-strong">
                    <ServiceGlyph icon={s.icon} className="size-16" />
                    <span className="text-lg font-medium tracking-[-0.02em]">{s.title}</span>
                    <span className="text-sm leading-relaxed text-fg-2">{s.shortDescription}</span>
                    <ArrowUpRight className="mt-auto size-4 text-fg-3 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 10. CTA */}
        <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card px-8 py-16 text-center sm:px-16 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 80% at 50% 0%, ${p.accent}22, transparent 70%)` }} />
          <h2 className="display relative mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4.5rem)] text-balance">
            Need something <span className="accent-serif">similar</span>?
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-fg-2">Tell us about your requirements and we&apos;ll show you how we&apos;d approach it.</p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/#contact" size="lg">
              Discuss a Similar Project
            </ButtonLink>
            {next && next.slug !== p.slug && (
              <ButtonLink href={`/work/${next.slug}`} size="lg" variant="ghost">
                Next: {next.title}
              </ButtonLink>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div className="text-fg">{children}</div>
    </div>
  );
}

function Block({ index, title, text, showPh, accent, placeholder }: { index: string; title: string; text: string | null; showPh: boolean; accent?: string; placeholder?: string }) {
  if (!text && !showPh) return null;
  return (
    <Reveal className="relative flex flex-col gap-5 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card p-8 sm:p-10">
      {accent && <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full blur-3xl" style={{ background: `${accent}1f` }} />}
      <span className="font-mono text-xs text-accent">{index}</span>
      <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{title}</h2>
      {text ? <p className="whitespace-pre-line leading-relaxed text-fg-2">{text}</p> : <EmptyNote>{placeholder ?? "Details to be added by the team."}</EmptyNote>}
    </Reveal>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line-strong p-6">
      <PlaceholderChip />
      <p className="text-sm text-fg-3">{children}</p>
    </div>
  );
}
