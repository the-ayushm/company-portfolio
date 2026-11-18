import "server-only";
import type { z } from "zod";
import type { projectSchema } from "@/lib/validations/admin";

type ProjectData = z.output<typeof projectSchema>;

export const projectInclude = {
  images: { orderBy: { order: "asc" as const } },
  services: { select: { slug: true, title: true } },
};

/** Maps validated admin input to Prisma create/update data (relations replaced wholesale). */
export function projectWriteData(d: ProjectData, mode: "create" | "update") {
  const { images, serviceSlugs, ...fields } = d;
  const imageRows = images.map((img, i) => ({ url: img.url, alt: img.alt, caption: img.caption, order: i }));
  const services = serviceSlugs.map((slug) => ({ slug }));
  return mode === "create"
    ? { ...fields, images: { create: imageRows }, services: { connect: services } }
    : { ...fields, images: { deleteMany: {}, create: imageRows }, services: { set: services } };
}
