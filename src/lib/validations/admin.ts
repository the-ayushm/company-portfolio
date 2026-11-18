import { z } from "zod";

/** "" → null, otherwise trimmed and length-limited. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v ? v : null));

/** Accepts absolute http(s) URLs or site-relative paths (e.g. /uploads/x.webp). */
const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .nullish()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^https?:\/\/\S+$/i.test(v) || /^\/[\w\-./]+$/.test(v), "Must be a URL (https://…) or a path starting with /");

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

const stringList = (maxItems: number, maxLen: number) =>
  z
    .array(z.string().trim().max(maxLen))
    .max(maxItems)
    .default([])
    .transform((list) => list.filter(Boolean));

const order = z.coerce.number().int().min(0).max(10_000).default(0);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Enter your password").max(200),
});

export const projectSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(10).max(600),
  overview: optionalText(10_000),
  problem: optionalText(10_000),
  solution: optionalText(10_000),
  features: stringList(40, 200),
  techStack: stringList(40, 60),
  contribution: optionalText(10_000),
  results: optionalText(10_000),
  visual: z.string().trim().max(40).default("generic"),
  accent: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #6D7CFF")
    .default("#6D7CFF"),
  coverImage: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(true),
  published: z.boolean().default(true),
  order,
  serviceSlugs: stringList(20, 80),
  images: z
    .array(
      z.object({
        url: z.string().trim().min(1).max(2048),
        alt: z.string().trim().max(240).default(""),
        caption: optionalText(240),
      }),
    )
    .max(30)
    .default([]),
});

export const serviceSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(120),
  shortDescription: z.string().trim().min(10).max(400),
  description: optionalText(5000),
  icon: z.string().trim().max(40).default("code"),
  technologies: stringList(20, 60),
  order,
  published: z.boolean().default(true),
});

export const teamMemberSchema = z.object({
  slug,
  name: z.string().trim().min(1).max(120),
  role: optionalText(120),
  bio: optionalText(2000),
  photoUrl: optionalUrl,
  skills: stringList(20, 60),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  order,
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(1).max(120),
  designation: optionalText(120),
  company: optionalText(160),
  avatarUrl: optionalUrl,
  review: z.string().trim().min(10).max(3000),
  projectName: optionalText(160),
  clientApproved: z.boolean().default(false),
  isPlaceholder: z.boolean().default(false),
  order,
  published: z.boolean().default(false),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(5000),
  order,
  published: z.boolean().default(true),
});

export const socialLinkSchema = z.object({
  platform: z.string().trim().toLowerCase().min(2).max(40),
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().url().max(2048),
  order,
  published: z.boolean().default(true),
});

export const settingsSchema = z.object({
  availableForProjects: z.boolean(),
  availabilityText: z.string().trim().min(2).max(120),
  contactEmail: z
    .string()
    .trim()
    .max(254)
    .nullish()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || z.email().safeParse(v).success, "Enter a valid email"),
});

export const inquiryStatuses = ["NEW", "CONTACTED", "IN_DISCUSSION", "CONVERTED", "REJECTED"] as const;
export type InquiryStatusValue = (typeof inquiryStatuses)[number];

export const inquiryUpdateSchema = z.object({
  status: z.enum(inquiryStatuses).optional(),
  adminNotes: optionalText(5000).optional(),
});

export const inquiryQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: z.enum(inquiryStatuses).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
});

export type ProjectInput = z.input<typeof projectSchema>;
export type ServiceInput = z.input<typeof serviceSchema>;
export type TeamMemberInput = z.input<typeof teamMemberSchema>;
export type TestimonialInput = z.input<typeof testimonialSchema>;
export type FaqInput = z.input<typeof faqSchema>;
export type SocialLinkInput = z.input<typeof socialLinkSchema>;
export type SettingsInput = z.input<typeof settingsSchema>;
