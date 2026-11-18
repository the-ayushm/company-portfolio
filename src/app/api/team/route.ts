import { NextResponse } from "next/server";
import { getTeam } from "@/lib/data/content";

/** GET /api/team — published team members. */
export async function GET() {
  return NextResponse.json({ data: await getTeam() });
}
