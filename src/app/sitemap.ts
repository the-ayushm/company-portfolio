import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProjects } from "@/lib/data/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const base = siteConfig.url;
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...staticPages,
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
