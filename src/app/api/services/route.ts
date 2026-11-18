import { NextResponse } from "next/server";
import { getServices } from "@/lib/data/content";

/** GET /api/services — published services (ordered). */
export async function GET() {
  return NextResponse.json({ data: await getServices() });
}
