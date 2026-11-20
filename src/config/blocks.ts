import type { BlockSpec } from "@/components/three/block";
import type { ClayName } from "@/components/ui/iso-block";
import { siteConfig } from "@/config/site";

const coreLabel = `${siteConfig.brand.wordmark.toUpperCase()} CORE`;

/** Hero cluster: matches the approved "Building Blocks" board (docs/design/concept-03-building-blocks.png). */
export const heroBlocks: BlockSpec[] = [
  { id: "whatsapp", title: "WhatsApp", label: "01 · CHAT", color: "sage", x: 0, z: 0, w: 1.9, h: 0.45, detail: "lines", lines: 3, service: "whatsapp-automation" },
  { id: "crm", title: "CRM", label: "02 · LEADS", color: "lilac", x: 0, z: -2.2, w: 1.9, h: 0.7, detail: "card", service: "crm-development" },
  { id: "orders", title: "Orders", label: "03 · SALES", color: "apricot", x: 2.2, z: 0, w: 1.9, h: 0.3, detail: "lines", lines: 3, service: "ecommerce-development" },
  { id: "payroll", title: "Payroll", label: "04 · TEAM", color: "white", x: 2.2, z: -2.2, w: 1.9, h: 0.55, detail: "lines", lines: 2, service: "erp-development" },
  { id: "core", title: "Automated", label: coreLabel, color: "lime", x: 0.25, z: -4.75, w: 2.4, h: 1.2, detail: "bars", core: true, service: "custom-software-development" },
  { id: "reports", title: "Reports", label: "05 · INSIGHT", color: "white", x: 2.65, z: -4.75, w: 1.9, h: 0.75, detail: "lines", lines: 2, service: "backend-api-engineering" },
  { id: "stock", title: "Stock", label: "06", color: "sage", x: 0.75, z: -7.45, w: 1.5, h: 0.36, service: "erp-development" },
];

/** Intro assembly order (the core always lands last). */
export const heroIntroOrder = ["orders", "whatsapp", "payroll", "crm", "reports", "stock"];

/** Blocks dropped on small screens. */
export const heroMobileHidden = ["stock", "reports"];

/** Block colour + short top-face title for each service icon key. */
export const serviceLooks: Record<string, { color: ClayName; short: string }> = {
  code: { color: "lime", short: "Custom" },
  erp: { color: "white", short: "ERP" },
  crm: { color: "lilac", short: "CRM" },
  whatsapp: { color: "sage", short: "WhatsApp" },
  ecommerce: { color: "apricot", short: "Store" },
  shopify: { color: "sage", short: "Shopify" },
  ai: { color: "lilac", short: "AI" },
  api: { color: "white", short: "APIs" },
};
export const serviceLook = (icon: string) => serviceLooks[icon] ?? serviceLooks.code!;

type Module = { title: string; label: string; color: ClayName };

/** Blocks for each project visual — named only after features already listed for that project. */
export const projectModules: Record<string, Module[]> = {
  "whatsapp-crm": [
    { title: "Inbox", label: "01 · CHAT", color: "sage" },
    { title: "Contacts", label: "02 · CRM", color: "lilac" },
    { title: "Campaigns", label: "03 · BROADCAST", color: "apricot" },
  ],
  workforce: [
    { title: "Staff", label: "01 · PEOPLE", color: "lilac" },
    { title: "Attendance", label: "02 · DAILY", color: "sage" },
    { title: "Payroll", label: "03 · SALARY", color: "white" },
    { title: "Reports", label: "04 · EVENTS", color: "apricot" },
  ],
  ecommerce: [
    { title: "Catalog", label: "01 · PRODUCTS", color: "sage" },
    { title: "Storefront", label: "02 · SHOP", color: "apricot" },
    { title: "Backend", label: "03 · DATA", color: "white" },
  ],
  erp: [
    { title: "Workflows", label: "01 · OPS", color: "sage" },
    { title: "Data", label: "02 · RECORDS", color: "white" },
    { title: "Reports", label: "03 · INSIGHT", color: "lilac" },
  ],
  shopify: [
    { title: "Storefront", label: "01 · SHOP", color: "sage" },
    { title: "Custom", label: "02 · THEME", color: "lilac" },
    { title: "Integrations", label: "03 · APPS", color: "apricot" },
  ],
  logistics: [
    { title: "Customers", label: "01 · CRM", color: "lilac" },
    { title: "Operations", label: "02 · OPS", color: "apricot" },
    { title: "Follow-ups", label: "03 · TASKS", color: "sage" },
  ],
  generic: [
    { title: "Data", label: "01", color: "white" },
    { title: "Logic", label: "02", color: "sage" },
    { title: "Interface", label: "03", color: "lilac" },
  ],
};

export const modulesFor = (visual: string): Module[] => projectModules[visual] ?? projectModules.generic!;

const slots = [
  { x: 0, z: 0, h: 0.45 },
  { x: 0, z: -2.2, h: 0.7 },
  { x: 2.2, z: 0, h: 0.3 },
  { x: 2.2, z: -2.2, h: 0.55 },
];

/** WebGL block map for a project's case-study hero: its modules in a 2×2 grid snapped to the core. */
export function projectBlocks(visual: string): BlockSpec[] {
  const mods = modulesFor(visual);
  return [
    ...mods.slice(0, 4).map((m, i) => ({
      id: `m${i}`,
      title: m.title,
      label: m.label,
      color: m.color,
      ...slots[i]!,
      w: 1.9,
      detail: (i % 2 === 0 ? "lines" : "card") as BlockSpec["detail"],
      lines: 3 - (i % 2),
    })),
    { id: "core", title: "Automated", label: coreLabel, color: "lime", x: 1.1, z: -4.75, w: 2.4, h: 1.2, detail: "bars", core: true },
  ];
}
