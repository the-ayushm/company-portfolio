"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldType = "text" | "textarea" | "number" | "boolean" | "list" | "image" | "select" | "gallery" | "services" | "color";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
  rows?: number;
};

export type Row = Record<string, any> & { id: string };

export type ResourceConfig = {
  title: string;
  description: string;
  endpoint: string;
  singular: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  summary: (row: Row) => { primary: string; secondary?: string; badges?: { label: string; tone?: "neutral" | "success" | "warning" | "danger" | "accent" }[] };
  toForm?: (row: Row) => Record<string, unknown>;
  publicHref?: (row: Row) => string;
};

const serviceIcons = ["code", "erp", "crm", "whatsapp", "ecommerce", "shopify", "ai", "api"].map((v) => ({ value: v, label: v }));
const visuals = ["whatsapp-crm", "workforce", "ecommerce", "erp", "shopify", "logistics", "generic"].map((v) => ({ value: v, label: v }));

const published = (row: Row) => (row.published ? { label: "Published", tone: "success" as const } : { label: "Draft", tone: "neutral" as const });

/** Strips server-managed fields so a row can be re-submitted to PUT. */
const pickFields = (row: Row, fields: FieldDef[]) => Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? null]));

export const resources: Record<string, ResourceConfig> = {
  projects: {
    title: "Projects",
    description: "Case studies shown in the Work section and on /work/[slug]. Only add verified details.",
    endpoint: "/api/admin/projects",
    singular: "project",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "URL slug", type: "text", hint: "lowercase-with-dashes — used in /work/<slug>" },
      { name: "category", label: "Category", type: "text", full: true },
      { name: "summary", label: "Summary", type: "textarea", full: true, rows: 3, hint: "1–2 sentences for cards and SEO." },
      { name: "overview", label: "Overview", type: "textarea", full: true },
      { name: "problem", label: "Business problem", type: "textarea", full: true },
      { name: "solution", label: "Our solution", type: "textarea", full: true },
      { name: "features", label: "Key features", type: "list", full: true, hint: "One per line." },
      { name: "techStack", label: "Technology stack", type: "list", hint: "Only technologies actually used." },
      { name: "serviceSlugs", label: "Related services", type: "services" },
      { name: "contribution", label: "Our contribution", type: "textarea", full: true, hint: "What exactly the team built or delivered." },
      { name: "results", label: "Results (verified only)", type: "textarea", full: true, hint: "Leave empty unless outcomes are verified and approved by the client." },
      { name: "coverImage", label: "Cover screenshot", type: "image", full: true, hint: "Replaces the illustrative sketch on cards." },
      { name: "images", label: "Gallery screenshots", type: "gallery", full: true },
      { name: "visual", label: "Illustrative sketch style", type: "select", options: visuals, hint: "Used only when no cover screenshot exists." },
      { name: "accent", label: "Accent colour", type: "color" },
      { name: "liveUrl", label: "Live URL", type: "text" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    defaults: { title: "", slug: "", category: "", summary: "", overview: null, problem: null, solution: null, features: [], techStack: [], serviceSlugs: [], contribution: null, results: null, coverImage: null, images: [], visual: "generic", accent: "#6D7CFF", liveUrl: null, order: 0, featured: true, published: false },
    summary: (r) => ({ primary: r.title, secondary: r.category, badges: [published(r), ...(r.coverImage || r.images?.length ? [] : [{ label: "No screenshots", tone: "warning" as const }])] }),
    toForm: (r) => ({
      ...pickFields(r, resources.projects!.fields),
      serviceSlugs: (r.services ?? []).map((s: { slug: string }) => s.slug),
      images: (r.images ?? []).map((i: any) => ({ url: i.url, alt: i.alt ?? "", caption: i.caption ?? null })),
    }),
    publicHref: (r) => `/work/${r.slug}`,
  },
  services: {
    title: "Services",
    description: "Services listed on the homepage and /services.",
    endpoint: "/api/admin/services",
    singular: "service",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "shortDescription", label: "Short description", type: "textarea", full: true, rows: 2 },
      { name: "description", label: "Full description", type: "textarea", full: true },
      { name: "technologies", label: "Typical tools", type: "list" },
      { name: "icon", label: "Icon", type: "select", options: serviceIcons },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    defaults: { title: "", slug: "", shortDescription: "", description: null, technologies: [], icon: "code", order: 0, published: true },
    summary: (r) => ({ primary: r.title, secondary: r.shortDescription, badges: [published(r)] }),
    publicHref: (r) => `/services#${r.slug}`,
  },
  team: {
    title: "Team",
    description: "Team member cards. Leave unknown fields empty — they show as “To be confirmed” while placeholders are enabled.",
    endpoint: "/api/admin/team",
    singular: "team member",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "bio", label: "Short introduction", type: "textarea", full: true },
      { name: "skills", label: "Skills & expertise", type: "list" },
      { name: "linkedinUrl", label: "LinkedIn URL", type: "text" },
      { name: "githubUrl", label: "GitHub URL", type: "text" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    defaults: { name: "", slug: "", role: null, photoUrl: null, bio: null, skills: [], linkedinUrl: null, githubUrl: null, order: 0, published: true },
    summary: (r) => ({ primary: r.name, secondary: r.role ?? "Role not set", badges: [published(r)] }),
  },
  testimonials: {
    title: "Testimonials",
    description: "Only testimonials marked “Client approved” AND “Published” appear publicly. Never publish without the client's written consent.",
    endpoint: "/api/admin/testimonials",
    singular: "testimonial",
    fields: [
      { name: "clientName", label: "Client name", type: "text" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "projectName", label: "Project name", type: "text" },
      { name: "review", label: "Review text", type: "textarea", full: true, hint: "In the client's own words." },
      { name: "avatarUrl", label: "Photo / approved avatar", type: "image", full: true },
      { name: "clientApproved", label: "Client approved publication", type: "boolean" },
      { name: "isPlaceholder", label: "Sample / placeholder", type: "boolean", hint: "Shown with a “Sample” label while placeholders are enabled." },
      { name: "published", label: "Published", type: "boolean" },
      { name: "order", label: "Sort order", type: "number" },
    ],
    defaults: { clientName: "", designation: null, company: null, projectName: null, review: "", avatarUrl: null, clientApproved: false, isPlaceholder: false, published: false, order: 0 },
    summary: (r) => ({
      primary: r.clientName,
      secondary: [r.designation, r.company].filter(Boolean).join(", "),
      badges: [
        published(r),
        r.isPlaceholder ? { label: "Sample", tone: "warning" } : r.clientApproved ? { label: "Approved", tone: "accent" } : { label: "Not approved", tone: "danger" },
      ],
    }),
  },
  faqs: {
    title: "FAQ",
    description: "Questions shown in the FAQ section (also emitted as FAQPage structured data).",
    endpoint: "/api/admin/faqs",
    singular: "question",
    fields: [
      { name: "question", label: "Question", type: "text", full: true },
      { name: "answer", label: "Answer", type: "textarea", full: true, rows: 6 },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    defaults: { question: "", answer: "", order: 0, published: true },
    summary: (r) => ({ primary: r.question, badges: [published(r)] }),
  },
  "social-links": {
    title: "Social links",
    description: "Agency profiles shown in the footer and structured data.",
    endpoint: "/api/admin/social-links",
    singular: "link",
    fields: [
      { name: "platform", label: "Platform key", type: "select", options: ["linkedin", "github", "instagram", "x", "website"].map((v) => ({ value: v, label: v })) },
      { name: "label", label: "Label", type: "text" },
      { name: "url", label: "URL", type: "text", full: true },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    defaults: { platform: "linkedin", label: "", url: "", order: 0, published: true },
    summary: (r) => ({ primary: r.label, secondary: r.url, badges: [published(r)] }),
  },
};

export function formFromRow(cfg: ResourceConfig, row: Row): Record<string, unknown> {
  return cfg.toForm ? cfg.toForm(row) : pickFields(row, cfg.fields);
}
