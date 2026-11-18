import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/api/http";

/** GET /api/admin/auth/me — the signed-in admin. */
export const GET = withAdmin(async (_req, _ctx, admin) => NextResponse.json({ data: admin }));
