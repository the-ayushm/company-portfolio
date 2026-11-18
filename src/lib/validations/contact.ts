import { z } from "zod";
import { budgetOptions, projectTypes, timelineOptions } from "@/config/contact";

const budgetValues = budgetOptions.map((o) => o.value) as [string, ...string[]];
const timelineValues = timelineOptions.map((o) => o.value) as [string, ...string[]];

/** Shared between the client form and POST /api/contact. */
export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Please enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((v) => v === "" || /^\+?[0-9()\-\s]{7,20}$/.test(v), "Please enter a valid phone / WhatsApp number.")
    .optional()
    .default(""),
  companyName: z.string().trim().max(160, "Company name is too long.").optional().default(""),
  projectType: z.enum(projectTypes, { error: "Please choose a project type." }),
  estimatedBudget: z.enum(budgetValues, { error: "Please choose a budget range." }),
  projectTimeline: z.enum(timelineValues, { error: "Please choose a timeline." }),
  description: z
    .string()
    .trim()
    .min(30, "Please share a little more detail (at least 30 characters).")
    .max(5000, "Please keep the description under 5,000 characters."),
  consent: z.literal(true, { error: "Please accept the privacy notice to continue." }),
  /** Honeypot — must stay empty. Hidden from humans. */
  website: z.string().max(0).optional().default(""),
  /** Epoch ms when the form was rendered — used to reject instant bot submissions. */
  startedAt: z.number().int().positive(),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormData = z.output<typeof contactSchema>;
