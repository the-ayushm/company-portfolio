import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight, Mail } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { getProjects, getServices, getSiteSettings, getSocialLinks } from "@/lib/data/content";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { FooterReveal } from "@/components/layout/footer-reveal";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export async function Footer() {
  const [services, projects, social, settings] = await Promise.all([getServices(), getProjects(), getSocialLinks(), getSiteSettings()]);

  return (
    <footer className="on-pine relative overflow-hidden bg-pine-3 text-porcelain">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(198,244,50,0.08)_1.2px,transparent_1.3px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <FooterReveal>
        <div className="container-x relative pt-24 pb-10 sm:pt-28">
          {/* Final CTA */}
          <div className="flex flex-col gap-10 border-b border-porcelain/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="h-section max-w-3xl text-balance">
              Let&apos;s turn your busywork into a <span className="hl">system that runs itself.</span>
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <ButtonLink href="/#contact" size="lg" variant="lime">
                Book a free audit
              </ButtonLink>
              <a href={`mailto:${settings.contactEmail}`} className="group inline-flex items-center gap-2 text-porcelain/70 transition-colors hover:text-porcelain">
                <Mail className="size-4" aria-hidden />
                <span className="underline-offset-4 group-hover:underline">{settings.contactEmail}</span>
              </a>
            </div>
          </div>

          <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="max-w-xs">
              <Logo tone="dark" />
              <p className="mt-6 text-sm font-light leading-relaxed text-porcelain/70">
                We design, build, automate and support custom software — from first requirements to deployment and beyond.
              </p>
              {social.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-porcelain/[0.07] py-2 pl-2 pr-4 text-sm text-porcelain/85 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime hover:text-pine"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-lime text-pine">
                    <WhatsappIcon className="size-4" />
                  </span>
                  {s.label || "WhatsApp"}
                </a>
              ))}
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

          <div className="flex flex-col gap-4 border-t border-porcelain/10 pt-8 text-xs text-porcelain/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CopyrightYear /> {siteConfig.brand.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="transition-colors hover:text-porcelain">
                Privacy notice
              </Link>
              <Link href="/sitemap.xml" className="transition-colors hover:text-porcelain">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-porcelain/60">{title}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group inline-flex items-center gap-1 text-sm text-porcelain/70 transition-colors duration-300 hover:text-porcelain">
        {children}
        <ArrowUpRight aria-hidden className="size-3 -translate-x-1 text-lime opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
    </li>
  );
}
