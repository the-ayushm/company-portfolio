import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { jsonError, readJson, validationError, withAdmin } from "@/lib/api/http";
import { invalidateContent } from "@/lib/api/crud";
import { projectInclude, projectWriteData } from "@/lib/api/projects";
import { projectSchema } from "@/lib/validations/admin";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withAdmin<Ctx>(async (_req, ctx) => {
  const { id } = await ctx.params;
  const data = await getPrisma().project.findUnique({ where: { id }, include: projectInclude });
  return data ? NextResponse.json({ data }) : jsonError(404, "NOT_FOUND", "Project not found.");
});

export const PUT = withAdmin<Ctx>(async (req, ctx) => {
  const { id } = await ctx.params;
  const parsed = projectSchema.safeParse(await readJson(req));
  if (!parsed.success) return validationError(parsed.error);
  const data = await getPrisma().project.update({
    where: { id },
    data: projectWriteData(parsed.data, "update"),
    include: projectInclude,
  });
  invalidateContent();
  return NextResponse.json({ data });
});

export const DELETE = withAdmin<Ctx>(async (_req, ctx) => {
  const { id } = await ctx.params;
  await getPrisma().project.delete({ where: { id } });
  invalidateContent();
  return new NextResponse(null, { status: 204 });
});
