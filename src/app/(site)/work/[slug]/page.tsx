import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjects, getServices } from "@/lib/data/content";
import { siteConfig } from "@/config/site";
import { ProjectHeroPanel } from "@/components/projects/project-hero-panel";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ServiceGlyph } from "@/components/services/service-glyph";
import { TextReveal } from "@/components/animations/text-reveal";
import { Reveal } from "@/components/animations/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PlaceholderChip } from "@/components/ui/placeholder-chip";
import { breadcrumbLd, JsonLd, projectLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { pad2 } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

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
    <div className="container-x pt-44 pb-32" aria-busy>
      <div className="h-4 w-40 animate-pulse rounded bg-pine/5" />
      <div className="mt-8 h-24 w-3/4 animate-pulse rounded-2xl bg-pine/5" />
      <div className="mt-16 aspect-[16/8] animate-pulse rounded-[var(--radius-xl)] bg-pine/10" />
    </div>
  );
}

/** Highlights the last word of a title. */
function titleSegments(title: string) {
  const words = title.split(" ");
  if (words.length < 2) return [{ text: title, hl: true }];
  return [words.slice(0, -1).join(" "), { text: words.at(-1)!, hl: true }];
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

      {/* Overview header */}
      <header className="relative pt-32 sm:pt-40">
        <div className="container-x">
          <Link href="/work" className="group mb-8 inline-flex items-center gap-2 text-sm text-fg-2 transition-colors hover:text-pine">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> All work
          </Link>
          <p className="eyebrow mb-5">
            {pad2(index + 1)} · {p.category}
          </p>
          <TextReveal as="h1" immediate segments={titleSegments(p.title)} className="display max-w-5xl text-[clamp(2.6rem,6vw,5.4rem)] text-balance" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Reveal delay={0.2}>
              <p className="lead max-w-2xl">{p.overview ?? p.summary}</p>
            </Reveal>
            <Reveal delay={0.3} className="grid grid-cols-2 gap-6 text-sm">
              <Meta label="Category">{p.category}</Meta>
              <Meta label="Services">{related.map((s) => s.title).join(", ") || "—"}</Meta>
              <Meta label="Technology">
                {p.techStack.length ? p.techStack.join(", ") : showPh ? <PlaceholderChip label="Stack to be listed" /> : "—"}
              </Meta>
              {p.liveUrl && (
                <Meta label="Live">
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:no-underline">
                    Visit site <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </Meta>
              )}
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.3} className="container-x mt-14">
          <ProjectHeroPanel visual={p.visual} title={p.title} />
        </Reveal>
      </header>

      <div className="container-x flex flex-col gap-24 py-24 sm:gap-28 sm:py-28">
        {/* Problem → What we built → Result */}
        <section aria-label="Problem, what we built and result" className="grid gap-4 lg:grid-cols-3">
          <Story index="01" title="The problem" text={p.problem} showPh={showPh} />
          <Story index="02" title="What we built" text={p.solution} showPh={showPh} />
          <Story index="03" title="The result" text={p.results} showPh={showPh} placeholder="Only verified outcomes will be published here." result />
        </section>

        {/* Features */}
        <section aria-labelledby="features-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <SubHeading index="04" id="features-title" lead="Key" hl="features" />
          {p.features.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.features.map((f, i) => (
                <Reveal as="li" key={f} delay={(i % 4) * 0.04} className="card flex items-center gap-3 rounded-[18px] p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-lime text-pine">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-pine">{f}</span>
                </Reveal>
              ))}
            </ul>
          ) : (
            showPh && <EmptyNote>Feature list to be added by the team.</EmptyNote>
          )}
        </section>

        {/* Technology */}
        <section aria-labelledby="tech-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <SubHeading index="05" id="tech-title" lead="Technology" hl="stack" />
          {p.techStack.length > 0 ? (
            <ul className="flex flex-wrap content-start gap-3">
              {p.techStack.map((t) => (
                <li key={t} className="keycap px-5 py-3 text-pine">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            showPh && <EmptyNote>Technologies used on this project will be listed once confirmed.</EmptyNote>
          )}
        </section>

        {/* Gallery */}
        <section aria-labelledby="gallery-title">
          <SubHeading index="06" id="gallery-title" lead="The" hl="screens" className="mb-10" />
          {p.images.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2">
              {p.images.map((img, i) => (
                <Reveal as="li" key={img.url} delay={(i % 2) * 0.1} className={i % 3 === 0 ? "md:col-span-2" : ""}>
                  <figure>
                    <div className="card relative aspect-[16/10] overflow-hidden">
                      <Image src={img.url} alt={img.alt || `${p.title} screenshot ${i + 1}`} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover object-top" />
                    </div>
                    {img.caption && <figcaption className="mt-3 text-sm text-fg-2">{img.caption}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <ProjectVisual project={p} className="aspect-[16/10]" />
              <div className="card flex flex-col justify-center gap-4 p-8">
                {showPh && <PlaceholderChip label="Screenshots coming soon" className="self-start" />}
                <p className="font-light leading-relaxed text-fg-2">
                  Real screenshots of this project will be published here. Want a walkthrough in the meantime? We can demo the
                  product on a call.
                </p>
                <ButtonLink href="/#contact" variant="ghost" className="self-start">
                  Request a demo
                </ButtonLink>
              </div>
            </div>
          )}
        </section>

        {/* Contribution */}
        {(p.contribution || showPh) && (
          <section aria-label="Our contribution" className="grid gap-4 md:grid-cols-2">
            <Story index="07" title="Our contribution" text={p.contribution} showPh={showPh} />
          </section>
        )}

        {/* Related services */}
        {related.length > 0 && (
          <section aria-labelledby="related-title">
            <SubHeading index="08" id="related-title" lead="Related" hl="services" className="mb-10" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="group card card-hover flex h-full flex-col gap-4 p-6">
                    <ServiceGlyph icon={s.icon} size={44} label={false} />
                    <span className="text-lg font-medium tracking-[-0.02em] text-pine">{s.title}</span>
                    <span className="text-sm font-light leading-relaxed text-fg-2">{s.shortDescription}</span>
                    <ArrowUpRight className="mt-auto size-4 text-pine transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="pine-panel on-pine px-8 py-16 text-center sm:px-16 sm:py-20">
          <h2 className="h-section mx-auto max-w-3xl text-balance text-porcelain">
            Need something <span className="hl">similar?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-light text-porcelain/75">Tell us about your requirements and we&apos;ll show you how we&apos;d approach it.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/#contact" size="lg" variant="lime">
              Discuss a similar project
            </ButtonLink>
            {next && next.slug !== p.slug && (
              <ButtonLink href={`/work/${next.slug}`} size="lg" variant="onDark" icon={false}>
                Next: {next.title}
              </ButtonLink>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

function SubHeading({ index, id, lead, hl, className }: { index: string; id: string; lead: string; hl: string; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4">{index}</p>
      <h2 id={id} className="h-section">
        {lead} <span className="hl">{hl}</span>
      </h2>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div className="text-pine">{children}</div>
    </div>
  );
}

function Story({
  index,
  title,
  text,
  showPh,
  placeholder,
  result = false,
}: {
  index: string;
  title: string;
  text: string | null;
  showPh: boolean;
  placeholder?: string;
  result?: boolean;
}) {
  if (!text && !showPh) return null;
  return (
    <Reveal className={cn("flex flex-col gap-5 rounded-[var(--radius-lg)] p-8 sm:p-9", result && text ? "pine-panel on-pine" : "card")}>
      <span className={cn("font-mono text-xs", result && text ? "text-porcelain/60" : "text-fg-3")}>{index}</span>
      <h2 className={cn("h-card", result && text ? "text-porcelain" : "text-pine")}>{title}</h2>
      {text ? (
        <p className={cn("whitespace-pre-line font-light leading-relaxed", result ? "text-porcelain/80" : "text-fg-2")}>{text}</p>
      ) : (
        <EmptyNote>{placeholder ?? "Details to be added by the team."}</EmptyNote>
      )}
    </Reveal>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[18px] border border-dashed border-line-strong bg-card/60 p-6">
      <PlaceholderChip />
      <p className="text-sm text-fg-2">{children}</p>
    </div>
  );
}
