import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/data/content";
import { jsonError } from "@/lib/api/http";

/** GET /api/projects/:slug — a single published project. */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const project = await getProjectBySlug(slug);
  if (!project) return jsonError(404, "NOT_FOUND", "Project not found.");
  return NextResponse.json({ data: project });
}
