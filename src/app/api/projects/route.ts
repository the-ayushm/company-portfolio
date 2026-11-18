import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data/content";

/** GET /api/projects — published projects (ordered). */
export async function GET() {
  return NextResponse.json({ data: await getProjects() });
}
