import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { jsonError, readJson, validationError, withAdmin } from "@/lib/api/http";
import { inquiryUpdateSchema } from "@/lib/validations/admin";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withAdmin<Ctx>(async (_req, ctx) => {
  const { id } = await ctx.params;
  const data = await getPrisma().contactInquiry.findUnique({ where: { id }, omit: { ipHash: true } });
  return data ? NextResponse.json({ data }) : jsonError(404, "NOT_FOUND", "Inquiry not found.");
});

/** PATCH /api/admin/inquiries/:id — update status and/or admin notes. */
export const PATCH = withAdmin<Ctx>(async (req, ctx) => {
  const { id } = await ctx.params;
  const parsed = inquiryUpdateSchema.safeParse(await readJson(req));
  if (!parsed.success) return validationError(parsed.error);
  const data = await getPrisma().contactInquiry.update({ where: { id }, data: parsed.data, omit: { ipHash: true } });
  return NextResponse.json({ data });
});

/** DELETE /api/admin/inquiries/:id — e.g. to honour a data deletion request. */
export const DELETE = withAdmin<Ctx>(async (_req, ctx) => {
  const { id } = await ctx.params;
  await getPrisma().contactInquiry.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
});
