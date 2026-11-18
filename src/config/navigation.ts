export type NavItem = { id: string; label: string; href: string };

/** Main navigation — ids match section ids on the homepage. */
export const mainNav: NavItem[] = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "services", label: "Services", href: "/#services" },
  { id: "work", label: "Work", href: "/#work" },
  { id: "why", label: "About", href: "/#why" },
  { id: "testimonials", label: "Testimonials", href: "/#testimonials" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export const capabilities = [
  "Custom Software",
  "Business Automation",
  "ERP & CRM",
  "E-commerce",
  "WhatsApp Solutions",
  "AI Integrations",
  "Backend & APIs",
  "Shopify Stores",
];
