import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/data/content";

/** GET /api/testimonials — client-approved, published testimonials (samples flagged with isPlaceholder). */
export async function GET() {
  return NextResponse.json({ data: await getTestimonials() });
}
