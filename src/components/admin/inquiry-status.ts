import type { InquiryStatusValue } from "@/lib/validations/admin";

export const statusMeta: Record<InquiryStatusValue, { label: string; tone: "neutral" | "success" | "warning" | "danger" | "accent" }> = {
  NEW: { label: "New", tone: "accent" },
  CONTACTED: { label: "Contacted", tone: "neutral" },
  IN_DISCUSSION: { label: "In discussion", tone: "warning" },
  CONVERTED: { label: "Converted", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

export type Inquiry = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  projectType: string;
  estimatedBudget: string;
  projectTimeline: string;
  description: string;
  consent: boolean;
  status: InquiryStatusValue;
  adminNotes: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
};
