import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight, Mail, Globe } from "lucide-react";
import { GithubIcon as Github, InstagramIcon as Instagram, LinkedinIcon as Linkedin, XIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { getProjects, getServices, getSiteSettings, getSocialLinks } from "@/lib/data/content";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { FooterReveal } from "@/components/layout/footer-reveal";

const socialIcon = (platform: string) => {
  switch (platform) {
    case "linkedin":
      return Linkedin;
    case "github":
      return Github;
    case "instagram":
      return Instagram;
    case "x":
      return XIcon;
    default:
      return Globe;
  }
};

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export async function Footer() {
  const [services, projects, social, settings] = await Promise.all([
    getServices(),
    getProjects(),
    getSocialLinks(),
    getSiteSettings(),
  ]);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]"
      />
      <FooterReveal>
        <div className="container-x relative pt-28 pb-10">
          {/* Final CTA */}
          <div className="flex flex-col gap-10 border-b border-line pb-20 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="display max-w-4xl text-[clamp(2.6rem,7vw,6.5rem)] text-balance">
              Let&apos;s turn your next <span className="accent-serif text-gradient">big idea</span> into reality.
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
              <ButtonLink href="/#contact" size="lg">
                Start a Project
              </ButtonLink>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="group inline-flex items-center gap-2 text-fg-2 transition-colors hover:text-fg"
              >
                <Mail className="size-4" aria-hidden />
                <span className="underline-offset-4 group-hover:underline">{settings.contactEmail}</span>
              </a>
            </div>
          </div>

          <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-5 text-sm leading-relaxed text-fg-2">
                A collaborative software engineering team building practical, scalable digital solutions — from
                requirements to deployment and beyond.
              </p>
              <ul className="mt-6 flex gap-2">
                {social.map((s) => {
                  const Icon = socialIcon(s.platform);
                  return (
                    <li key={s.platform}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="grid size-10 place-items-center rounded-full border border-line-strong text-fg-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-fg/40 hover:text-fg"
                      >
                        <Icon className="size-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <FooterColumn title="Navigate">
              {mainNav.map((n) => (
                <FooterLink key={n.id} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
              <FooterLink href="/work">All work</FooterLink>
            </FooterColumn>

            <FooterColumn title="Services">
              {services.map((s) => (
                <FooterLink key={s.slug} href={`/services#${s.slug}`}>
                  {s.title}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Projects">
              {projects.map((p) => (
                <FooterLink key={p.slug} href={`/work/${p.slug}`}>
                  {p.title}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>

          <div className="flex flex-col gap-4 border-t border-line pt-8 text-xs text-fg-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CopyrightYear /> {siteConfig.brand.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="transition-colors hover:text-fg">
                Privacy notice
              </Link>
              <Link href="/sitemap.xml" className="transition-colors hover:text-fg">
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <p className="display -mb-[0.18em] whitespace-nowrap text-center text-[18vw] leading-none text-white/[0.035]">
            {siteConfig.brand.name}
          </p>
        </div>
      </FooterReveal>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-sm text-fg-2 transition-colors duration-300 hover:text-fg"
      >
        {children}
        <ArrowUpRight
          aria-hidden
          className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </Link>
    </li>
  );
}
