import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { isSameOrigin, jsonError } from "@/lib/api/http";

/** POST /api/admin/auth/logout — clears the session cookie. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return jsonError(403, "FORBIDDEN", "Cross-origin request rejected.");
  await clearSessionCookie();
  return new NextResponse(null, { status: 204 });
}
