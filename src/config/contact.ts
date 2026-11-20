/**
 * Contact form options. Budget ranges are in INR and fully configurable.
 * Values are stored in the database as the `value` string.
 */
export const projectTypes = [
  "Custom Web Application",
  "ERP Development",
  "CRM Development",
  "WhatsApp Automation",
  "E-commerce Development",
  "Shopify Development",
  "AI Integration",
  "Backend / API Development",
  "Other",
] as const;

export const budgetOptions = [
  { value: "under-1l", label: "Under ₹1 Lakh" },
  { value: "1l-3l", label: "₹1 – 3 Lakh" },
  { value: "3l-7l", label: "₹3 – 7 Lakh" },
  { value: "7l-15l", label: "₹7 – 15 Lakh" },
  { value: "15l-plus", label: "₹15 Lakh +" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3m", label: "1 – 3 months" },
  { value: "3-6m", label: "3 – 6 months" },
  { value: "6m-plus", label: "6 months +" },
  { value: "flexible", label: "Flexible" },
] as const;

/** Maps a service slug to the contact-form project type it pre-selects. */
export const serviceToProjectType: Record<string, (typeof projectTypes)[number]> = {
  "custom-software-development": "Custom Web Application",
  "erp-development": "ERP Development",
  "crm-development": "CRM Development",
  "whatsapp-automation": "WhatsApp Automation",
  "ecommerce-development": "E-commerce Development",
  "shopify-development": "Shopify Development",
  "ai-integration": "AI Integration",
  "backend-api-engineering": "Backend / API Development",
};

export const labelFor = (
  list: readonly { value: string; label: string }[],
  value: string,
): string => list.find((o) => o.value === value)?.label ?? value;

/** Only WhatsApp is shown publicly. Add it in /admin → Social links: platform "whatsapp", URL https://wa.me/<number>. */
export const socialDefaults: { platform: string; label: string; url: string }[] = [];
