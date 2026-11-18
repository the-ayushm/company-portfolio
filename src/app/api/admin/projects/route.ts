import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { readJson, validationError, withAdmin } from "@/lib/api/http";
import { invalidateContent } from "@/lib/api/crud";
import { projectInclude, projectWriteData } from "@/lib/api/projects";
import { projectSchema } from "@/lib/validations/admin";

/** GET /api/admin/projects — all projects including drafts. */
export const GET = withAdmin(async () => {
  const data = await getPrisma().project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: projectInclude,
  });
  return NextResponse.json({ data });
});

/** POST /api/admin/projects — create a project. */
export const POST = withAdmin(async (req) => {
  const parsed = projectSchema.safeParse(await readJson(req));
  if (!parsed.success) return validationError(parsed.error);
  const data = await getPrisma().project.create({ data: projectWriteData(parsed.data, "create"), include: projectInclude });
  invalidateContent();
  return NextResponse.json({ data }, { status: 201 });
});
