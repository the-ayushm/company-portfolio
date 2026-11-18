import { NextResponse } from "next/server";
import { getFaqs } from "@/lib/data/content";

/** GET /api/faqs — published FAQs. */
export async function GET() {
  return NextResponse.json({ data: await getFaqs() });
}
