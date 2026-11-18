import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPrisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { errorMeta, logger } from "@/lib/utils/logger";
import { siteConfig } from "@/config/site";
import { projectsConfig } from "@/config/projects";
import { servicesConfig } from "@/config/services";
import { teamConfig } from "@/config/team";
import { testimonialsConfig } from "@/config/testimonials";
import { faqsConfig } from "@/config/faqs";
import { socialDefaults } from "@/config/contact";
import type {
  FaqContent,
  ProjectContent,
  ServiceContent,
  SiteSettingsContent,
  SocialLinkContent,
  TeamMemberContent,
  TestimonialContent,
} from "@/types/content";

/**
 * Public content access.
 * Reads from PostgreSQL (managed in /admin). If the database is unreachable,
 * falls back to src/config so the marketing site never goes down.
 * Results are cached and invalidated with revalidateTag(CONTENT_TAG) on admin writes.
 */
export const CONTENT_TAG = "content";

async function withFallback<T>(label: string, query: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!isDatabaseConfigured()) return fallback();
  try {
    return await query();
  } catch (err) {
    logger.warn(`DB unavailable for ${label}; using config fallback`, errorMeta(err));
    return fallback();
  }
}

export async function getProjects(): Promise<ProjectContent[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return withFallback(
    "projects",
    async () => {
      const rows = await getPrisma().project.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: { images: { orderBy: { order: "asc" } }, services: { select: { slug: true } } },
      });
      return rows.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        summary: p.summary,
        overview: p.overview,
        problem: p.problem,
        solution: p.solution,
        features: p.features,
        techStack: p.techStack,
        contribution: p.contribution,
        results: p.results,
        visual: p.visual,
        accent: p.accent,
        coverImage: p.coverImage,
        liveUrl: p.liveUrl,
        images: p.images.map((i) => ({ url: i.url, alt: i.alt, caption: i.caption })),
        serviceSlugs: p.services.map((s) => s.slug),
        updatedAt: p.updatedAt.toISOString(),
      }));
    },
    () => projectsConfig,
  );
}

export async function getProjectBySlug(slug: string): Promise<ProjectContent | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getServices(): Promise<ServiceContent[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return withFallback(
    "services",
    async () => {
      const rows = await getPrisma().service.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((s) => ({
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        description: s.description,
        icon: s.icon,
        technologies: s.technologies,
      }));
    },
    () => servicesConfig,
  );
}

export async function getTeam(): Promise<TeamMemberContent[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return withFallback(
    "team",
    async () => {
      const rows = await getPrisma().teamMember.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((m) => ({
        slug: m.slug,
        name: m.name,
        role: m.role,
        bio: m.bio,
        photoUrl: m.photoUrl,
        skills: m.skills,
        linkedinUrl: m.linkedinUrl,
        githubUrl: m.githubUrl,
      }));
    },
    () => teamConfig,
  );
}

/**
 * Only client-approved, published testimonials are public.
 * Sample (placeholder) rows are included only while placeholders are enabled.
 */
export async function getTestimonials(): Promise<TestimonialContent[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const allowSamples = siteConfig.showPlaceholderTestimonials;
  return withFallback(
    "testimonials",
    async () => {
      const rows = await getPrisma().testimonial.findMany({
        where: {
          published: true,
          OR: [{ clientApproved: true, isPlaceholder: false }, ...(allowSamples ? [{ isPlaceholder: true }] : [])],
        },
        orderBy: [{ isPlaceholder: "asc" }, { order: "asc" }, { createdAt: "desc" }],
      });
      return rows.map((t) => ({
        id: t.id,
        clientName: t.clientName,
        designation: t.designation,
        company: t.company,
        avatarUrl: t.avatarUrl,
        review: t.review,
        projectName: t.projectName,
        isPlaceholder: t.isPlaceholder,
      }));
    },
    () => (allowSamples ? testimonialsConfig : []),
  );
}

export async function getFaqs(): Promise<FaqContent[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return withFallback(
    "faqs",
    async () => {
      const rows = await getPrisma().faq.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((f) => ({ question: f.question, answer: f.answer }));
    },
    () => faqsConfig,
  );
}

export async function getSocialLinks(): Promise<SocialLinkContent[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return withFallback(
    "social links",
    async () => {
      const rows = await getPrisma().socialLink.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }],
      });
      return rows.map((s) => ({ platform: s.platform, label: s.label, url: s.url }));
    },
    () => socialDefaults,
  );
}

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const fallback = (): SiteSettingsContent => ({
    availableForProjects: siteConfig.availability.availableForProjects,
    availabilityText: siteConfig.availability.availabilityText,
    contactEmail: siteConfig.contactEmail,
  });
  return withFallback(
    "settings",
    async () => {
      const row = await getPrisma().siteSettings.findUnique({ where: { id: 1 } });
      if (!row) return fallback();
      return {
        availableForProjects: row.availableForProjects,
        availabilityText: row.availabilityText,
        contactEmail: row.contactEmail || siteConfig.contactEmail,
      };
    },
    fallback,
  );
}
