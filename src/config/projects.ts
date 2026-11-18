import type { ProjectContent } from "@/types/content";

/**
 * PROJECTS — content is taken only from the team's own brief.
 *
 *  • techStack: only technologies explicitly confirmed are listed. Add the rest in /admin.
 *  • contribution / results: left empty on purpose. Add verified details only.
 *  • images: add real screenshots in /admin → Projects. Until then the site renders an
 *    illustrative, clearly-labelled interface sketch (never stock imagery).
 */
export const projectsConfig: ProjectContent[] = [
  {
    slug: "soft7-whatsapp-crm",
    title: "SOFT7",
    category: "WhatsApp Business CRM & Automation Platform",
    summary:
      "A comprehensive WhatsApp Business solution that helps businesses manage customer conversations, automate communication and improve engagement.",
    overview:
      "SOFT7 brings WhatsApp Business communication into a single CRM workspace. Teams manage every customer conversation from a unified inbox, organise contacts, assign conversations to team members, and run template-based campaigns and automated workflows on top of the WhatsApp Business API.",
    problem:
      "Businesses that talk to customers on WhatsApp quickly outgrow a single phone. Conversations get scattered across devices, nobody knows who is handling which customer, follow-ups slip, and there is no structured way to run campaigns or automate repetitive replies.",
    solution:
      "A WhatsApp Business API–powered platform with a shared team inbox, conversation assignment, contact and team management, approved message templates, campaign management and automated workflows — so communication becomes organised, measurable and scalable.",
    features: [
      "WhatsApp Business API integration",
      "Unified inbox & conversation management",
      "Contact management",
      "Team member management",
      "Conversation assignment",
      "WhatsApp message templates",
      "Campaign management",
      "Automated workflows",
      "Customer engagement tools",
      "CRM functionality",
    ],
    techStack: ["WhatsApp Business API"],
    contribution: null,
    results: null,
    visual: "whatsapp-crm",
    accent: "#3DDC97",
    coverImage: null,
    liveUrl: null,
    images: [],
    serviceSlugs: ["whatsapp-automation", "crm-development", "backend-api-engineering"],
  },
  {
    slug: "doveknot-wedstaff",
    title: "Doveknot — WedStaff",
    category: "Event Management & Workforce Management Platform",
    summary:
      "A workforce management solution that simplifies event staffing, attendance, payments and operational reporting.",
    overview:
      "WedStaff manages the people side of events: freelancers and supervisors, staff allocation per event, attendance, overtime, expenses, payments and salaries — with financial reporting per event and role-based access for Admins, Supervisors and Freelancers.",
    problem:
      "Event staffing involves many freelancers across many events. Tracking who worked where, attendance, overtime, expenses and payouts in spreadsheets and chats is slow, error-prone and makes event-level financials hard to see.",
    solution:
      "A role-based platform where admins allocate staff to events, supervisors record attendance and overtime, and payments, expenses and salaries are calculated and tracked in one place — with event financial reports and Excel exports.",
    features: [
      "Freelancer management",
      "Supervisor management",
      "Event staff allocation",
      "Attendance tracking",
      "Payment management",
      "Expense management",
      "Overtime tracking",
      "Salary management",
      "Event financial reporting",
      "Excel / report exports",
      "Role-based access: Admin, Supervisor, Freelancer",
    ],
    techStack: [],
    contribution: null,
    results: null,
    visual: "workforce",
    accent: "#FFB86B",
    coverImage: null,
    liveUrl: null,
    images: [],
    serviceSlugs: ["custom-software-development", "erp-development", "backend-api-engineering"],
  },
  {
    slug: "jeevanka-ayurveda",
    title: "Jeevanka Ayurveda",
    category: "Ayurvedic E-commerce Platform",
    summary:
      "An e-commerce platform for selling Ayurvedic products online, with a product catalog, detailed product pages and a complete storefront.",
    overview:
      "Jeevanka Ayurveda is an online storefront for Ayurvedic products. It presents the product catalog and detailed product pages in a clean shopping experience, backed by a backend and database integration that powers the business website.",
    problem:
      "An Ayurvedic brand needed a credible online presence where customers can discover products, understand them in detail and shop with confidence.",
    solution:
      "An e-commerce storefront with a structured product catalog, rich product detail pages and a customer-friendly shopping experience, connected to a backend and database.",
    features: [
      "Product catalog",
      "Product detail pages",
      "E-commerce storefront",
      "Customer shopping experience",
      "Backend & database integration",
      "Business website functionality",
    ],
    techStack: [],
    contribution: null,
    results: null,
    visual: "ecommerce",
    accent: "#C9E265",
    coverImage: null,
    liveUrl: null,
    images: [],
    serviceSlugs: ["ecommerce-development", "custom-software-development"],
  },
  {
    slug: "erp-solutions",
    title: "ERP Solutions",
    category: "Enterprise Business Software",
    summary:
      "Custom ERP development and business process management solutions for operations-heavy businesses.",
    overview:
      "Custom ERP and business process management work — bringing operational workflows, data and reporting into integrated systems.",
    problem: null,
    solution: null,
    features: [],
    techStack: [],
    contribution: null,
    results: null,
    visual: "erp",
    accent: "#7C8CFF",
    coverImage: null,
    liveUrl: null,
    images: [],
    serviceSlugs: ["erp-development", "custom-software-development"],
  },
  {
    slug: "shopify-development",
    title: "Shopify Development",
    category: "E-commerce Solutions",
    summary:
      "Shopify store development and customisation — storefront experiences and business workflow integrations.",
    overview:
      "Shopify development and customisation work across storefront experience and integrations.",
    problem: null,
    solution: null,
    features: [],
    techStack: ["Shopify"],
    contribution: null,
    results: null,
    visual: "shopify",
    accent: "#95BF47",
    coverImage: null,
    liveUrl: null,
    images: [],
    serviceSlugs: ["shopify-development", "ecommerce-development"],
  },
  {
    slug: "crm-logistics-crm",
    title: "CRM & Logistics CRM",
    category: "Customer and Logistics Management",
    summary:
      "CRM workflows and logistics-focused business management systems for tracking customers, operations and follow-ups.",
    overview:
      "Our experience with CRM workflows and logistics-related business management systems.",
    problem: null,
    solution: null,
    features: [],
    techStack: [],
    contribution: null,
    results: null,
    visual: "logistics",
    accent: "#4FD1FF",
    coverImage: null,
    liveUrl: null,
    images: [],
    serviceSlugs: ["crm-development", "custom-software-development"],
  },
];
