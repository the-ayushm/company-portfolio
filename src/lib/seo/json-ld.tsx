import { siteConfig } from "@/config/site";
import type { FaqContent, ProjectContent, ServiceContent, SocialLinkContent } from "@/types/content";

/** Renders a JSON-LD script tag. `<` is escaped to prevent script injection. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationLd(social: SocialLinkContent[], services: ServiceContent[], email: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.brand.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email,
    sameAs: social.map((s) => s.url),
    knowsAbout: services.map((s) => s.title),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software development services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.shortDescription },
      })),
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: siteConfig.url,
  };
}

export function faqLd(faqs: FaqContent[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function projectLd(p: ProjectContent) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    headline: `${p.title} — ${p.category}`,
    description: p.summary,
    url: `${siteConfig.url}/work/${p.slug}`,
    creator: { "@type": "Organization", name: siteConfig.brand.name, url: siteConfig.url },
    keywords: [p.category, ...p.techStack].join(", "),
    ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteConfig.url}${it.path}`,
    })),
  };
}
