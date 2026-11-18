import "server-only";
import { getPrisma } from "@/lib/db/prisma";
import { createCrud } from "@/lib/api/crud";
import { faqSchema, serviceSchema, socialLinkSchema, teamMemberSchema, testimonialSchema } from "@/lib/validations/admin";

/** Admin CRUD handlers for the simple content models (projects have custom handlers). */
export const servicesCrud = createCrud({ delegate: () => getPrisma().service, schema: serviceSchema });
export const teamCrud = createCrud({ delegate: () => getPrisma().teamMember, schema: teamMemberSchema });
export const testimonialsCrud = createCrud({ delegate: () => getPrisma().testimonial, schema: testimonialSchema });
export const faqsCrud = createCrud({ delegate: () => getPrisma().faq, schema: faqSchema });
export const socialLinksCrud = createCrud({ delegate: () => getPrisma().socialLink, schema: socialLinkSchema });
