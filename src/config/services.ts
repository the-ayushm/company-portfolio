import type { ServiceContent } from "@/types/content";

/**
 * SERVICES — technologies listed are representative tools for the service,
 * not a claim that every project used all of them. Edit in /admin → Services.
 */
export const servicesConfig: ServiceContent[] = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    shortDescription:
      "Tailored web applications and software platforms built around your specific business requirements.",
    description:
      "When off-the-shelf tools don't fit the way your business works, we design and build software that does. We start from your workflows, define the data model and architecture, and deliver a maintainable web application your team can rely on.",
    icon: "code",
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    slug: "erp-development",
    title: "ERP Development",
    shortDescription:
      "Integrated business management systems that streamline operations, workflows and reporting.",
    description:
      "We build ERP modules that bring operations, finance, inventory and people into one system — with role-based access, approval workflows and the reports your management actually uses.",
    icon: "erp",
    technologies: ["Node.js", "PostgreSQL", "REST APIs", "Role-based access"],
  },
  {
    slug: "crm-development",
    title: "CRM Development",
    shortDescription:
      "Customer management, lead tracking and workflow automation shaped to your sales process.",
    description:
      "From lead capture to follow-ups and conversions, we build CRMs that mirror your pipeline instead of forcing you into someone else's — including logistics and operations-focused CRM workflows.",
    icon: "crm",
    technologies: ["React", "Node.js", "PostgreSQL", "Socket.IO"],
  },
  {
    slug: "whatsapp-automation",
    title: "WhatsApp Automation",
    shortDescription:
      "WhatsApp Business API integrations, automated messaging, chat workflows and campaigns.",
    description:
      "We integrate the WhatsApp Business API into your operations: shared team inboxes, message templates, broadcast campaigns, automated replies and workflows that keep customer conversations organised.",
    icon: "whatsapp",
    technologies: ["WhatsApp Business API", "Node.js", "Webhooks", "Redis"],
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    shortDescription:
      "Modern storefronts with catalogs, order management, payments and admin dashboards.",
    description:
      "Custom e-commerce platforms with fast product catalogs, clean checkout flows, payment gateway integrations, order management and the admin tools needed to run the store day to day.",
    icon: "ecommerce",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Payment gateways"],
  },
  {
    slug: "shopify-development",
    title: "Shopify Development",
    shortDescription:
      "Shopify store setup, theme customisation and integrations with your business workflows.",
    description:
      "We set up and customise Shopify stores, refine storefront experiences and connect Shopify to the rest of your business through apps and integrations.",
    icon: "shopify",
    technologies: ["Shopify", "Liquid", "Shopify APIs"],
  },
  {
    slug: "ai-integration",
    title: "AI Integration",
    shortDescription:
      "Practical AI capabilities inside your applications to automate repetitive work.",
    description:
      "We integrate AI where it genuinely helps — classifying and routing messages, drafting replies, extracting data from documents and building intelligent workflows — with humans kept in the loop.",
    icon: "ai",
    technologies: ["LLM APIs", "Node.js", "TypeScript"],
  },
  {
    slug: "backend-api-engineering",
    title: "Backend & API Engineering",
    shortDescription:
      "Scalable backends, database architecture, REST APIs, authentication and integrations.",
    description:
      "Robust server-side systems: database design, REST APIs, authentication and authorisation, background jobs and third-party integrations — built to be observable and easy to extend.",
    icon: "api",
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "Prisma", "Redis"],
  },
];
