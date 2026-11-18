import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetaInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

/** Builds consistent page metadata (title, canonical, Open Graph, Twitter/X). */
export function pageMetadata({ title, description, path = "/", image, noIndex }: PageMetaInput = {}): Metadata {
  const desc = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.brand.name,
      title: title ? `${title} — ${siteConfig.brand.name}` : siteConfig.brand.name,
      description: desc,
      locale: siteConfig.locale,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} — ${siteConfig.brand.name}` : siteConfig.brand.name,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
