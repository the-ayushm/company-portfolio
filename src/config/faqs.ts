import type { FaqContent } from "@/types/content";

/** FAQ answers — configurable here (seed) or in /admin → FAQ. */
export const faqsConfig: FaqContent[] = [
  {
    question: "What types of software projects do you develop?",
    answer:
      "We build custom web applications, ERP and CRM systems, WhatsApp Business automation platforms, e-commerce stores (custom and Shopify), backend systems and APIs, and AI-assisted workflows. If your project is software that helps a business operate better, it's likely in our wheelhouse — tell us about it.",
  },
  {
    question: "Can you build large-scale enterprise applications?",
    answer:
      "Yes. We design for scale from the start — a clear modular architecture, a well-modelled PostgreSQL database, role-based access, and APIs that can grow with your business. For larger engagements we agree on phased milestones so you see working software early and often.",
  },
  {
    question: "Do you develop custom ERP and CRM systems?",
    answer:
      "Yes. ERP and CRM work is a core part of what we do — from workforce and event operations to lead pipelines and logistics workflows. We model the system around how your business actually operates rather than forcing a generic template.",
  },
  {
    question: "Can you integrate WhatsApp Business API?",
    answer:
      "Yes. We have built WhatsApp Business API–based products including shared inboxes, conversation assignment, message templates, campaigns and automated workflows. We can build a new solution or integrate WhatsApp into your existing systems.",
  },
  {
    question: "Do you develop Shopify stores?",
    answer:
      "Yes — store setup, theme customisation and integrations between Shopify and your other business tools. If Shopify isn't the right fit, we can also build a custom e-commerce platform.",
  },
  {
    question: "Can you work with an existing codebase?",
    answer:
      "Yes. We start with a short technical review to understand the architecture, code quality and risks, then agree on a plan — whether that's adding features, fixing issues, improving performance or gradually modernising the system.",
  },
  {
    question: "How do you estimate project costs?",
    answer:
      "After a discovery conversation we break the scope into modules and estimate the effort for each. You receive a written proposal with scope, milestones, timeline and cost. For evolving products we can also work on a monthly or milestone basis.",
  },
  {
    question: "Do you provide post-launch support?",
    answer:
      "Yes, when agreed. We offer ongoing maintenance and support — monitoring, bug fixes, security updates and continued feature development — with the scope defined in a support agreement.",
  },
  {
    question: "How can we start a project?",
    answer:
      "Fill in the project form on this page or email us. We'll review your requirements, get back to you to schedule a discovery call, and follow up with a proposal.",
  },
];
