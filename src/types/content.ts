/**
 * Shared content shapes used by the public site.
 * Data comes from PostgreSQL (editable in /admin) with a fallback to src/config/*.
 */

export type TeamMemberContent = {
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  photoUrl: string | null;
  skills: string[];
  linkedinUrl: string | null;
  githubUrl: string | null;
};

export type ServiceIconKey =
  | "code"
  | "erp"
  | "crm"
  | "whatsapp"
  | "ecommerce"
  | "shopify"
  | "ai"
  | "api";

export type ServiceContent = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string | null;
  icon: ServiceIconKey | string;
  technologies: string[];
};

export type ProjectVisualKey =
  | "whatsapp-crm"
  | "workforce"
  | "ecommerce"
  | "erp"
  | "shopify"
  | "logistics"
  | "generic";

export type ProjectImageContent = {
  url: string;
  alt: string;
  caption: string | null;
};

export type ProjectContent = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  overview: string | null;
  problem: string | null;
  solution: string | null;
  features: string[];
  techStack: string[];
  contribution: string | null;
  results: string | null;
  visual: ProjectVisualKey | string;
  accent: string;
  coverImage: string | null;
  liveUrl: string | null;
  images: ProjectImageContent[];
  serviceSlugs: string[];
  updatedAt?: string;
};

export type TestimonialContent = {
  id: string;
  clientName: string;
  designation: string | null;
  company: string | null;
  avatarUrl: string | null;
  review: string;
  projectName: string | null;
  isPlaceholder: boolean;
};

export type FaqContent = { question: string; answer: string };

export type SocialLinkContent = { platform: string; label: string; url: string };

export type SiteSettingsContent = {
  availableForProjects: boolean;
  availabilityText: string;
  contactEmail: string;
};
