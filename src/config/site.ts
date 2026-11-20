/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to rebrand the website.
 * ─────────────────────────────────────────────────────────────
 * The brand name is intentionally a placeholder until the team finalizes it.
 * Set NEXT_PUBLIC_BRAND_NAME in .env to override without touching code.
 */

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Nexor Automations";
const [firstWord = brandName, ...restWords] = brandName.split(/\s+/);

export const siteConfig = {
  brand: {
    name: brandName,
    /** Lowercase wordmark ("nexor") followed by a lime full stop in the logo. */
    wordmark: firstWord.toLowerCase(),
    /** Small mono line under the wordmark ("AUTOMATIONS"). */
    descriptor: restWords.join(" ").toUpperCase(),
    /** Short mark shown in the logo glyph. */
    monogram: process.env.NEXT_PUBLIC_BRAND_MONOGRAM?.trim() || brandName.charAt(0),
    tagline: "Custom software, ERP, CRM & WhatsApp automation",
  },
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  description:
    "We design, develop and scale powerful digital solutions — custom software, ERP & CRM platforms, WhatsApp automation, e-commerce and backend systems — for businesses ready to grow.",
  keywords: [
    "custom software development",
    "ERP development",
    "CRM development",
    "WhatsApp Business API automation",
    "e-commerce development",
    "Shopify development",
    "Next.js development",
    "Node.js backend development",
    "software development agency India",
  ],
  /** Fallback contact email (the admin panel setting takes precedence). */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@yourdomain.com",
  /** Fallback availability (the admin panel setting takes precedence). */
  availability: {
    availableForProjects: true,
    availabilityText: "Available for selected projects",
  },
  /**
   * While content is being finalized, unknown fields (roles, bios, contribution notes…)
   * render a visible "To be confirmed" marker instead of invented text.
   * Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=false before launch to hide empty fields entirely.
   */
  showContentPlaceholders: process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false",
  /**
   * Sample testimonials are only rendered when this is true, and always with a
   * "Sample" label. Real testimonials need `clientApproved` + `published` in the admin.
   */
  showPlaceholderTestimonials: process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false",
} as const;

export type SiteConfig = typeof siteConfig;
