/**
 * Technologies the team works with. This is a capabilities list — it does not imply
 * that every project used every technology. Edit freely.
 */
export type TechItem = { name: string; group: TechGroup; color: string };
export type TechGroup = "Frontend" | "Backend" | "Data" | "Commerce & Messaging";

export const techStack: TechItem[] = [
  { name: "Next.js", group: "Frontend", color: "#F5F5F7" },
  { name: "React", group: "Frontend", color: "#61DAFB" },
  { name: "TypeScript", group: "Frontend", color: "#3178C6" },
  { name: "Tailwind CSS", group: "Frontend", color: "#38BDF8" },
  { name: "Node.js", group: "Backend", color: "#5FA04E" },
  { name: "REST APIs", group: "Backend", color: "#A78BFA" },
  { name: "Socket.IO", group: "Backend", color: "#E5E7EB" },
  { name: "PostgreSQL", group: "Data", color: "#4169E1" },
  { name: "Prisma", group: "Data", color: "#7C8CFF" },
  { name: "MongoDB", group: "Data", color: "#47A248" },
  { name: "Redis", group: "Data", color: "#FF4438" },
  { name: "Shopify", group: "Commerce & Messaging", color: "#95BF47" },
  { name: "WhatsApp Business API", group: "Commerce & Messaging", color: "#25D366" },
];

export const techGroups: TechGroup[] = ["Frontend", "Backend", "Data", "Commerce & Messaging"];
