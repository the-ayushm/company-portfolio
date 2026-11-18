import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/db/prisma";
import { createSessionCookie } from "@/lib/auth/session";
import { handleUnknownError, isSameOrigin, jsonError, readJson, validationError } from "@/lib/api/http";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { loginSchema } from "@/lib/validations/admin";
import { logger } from "@/lib/utils/logger";

// When the email is unknown we still run a bcrypt comparison so response timing
// doesn't reveal which admin emails exist.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("timing-equaliser", 12));

/** POST /api/admin/auth/login — { email, password } → sets an httpOnly session cookie. */
export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req)) return jsonError(403, "FORBIDDEN", "Cross-origin request rejected.");
    const ip = clientIp(req.headers);
    const limit = rateLimit(`login:${ip}`, 8, 15 * 60_000);
    if (!limit.ok) {
      return jsonError(429, "RATE_LIMITED", "Too many sign-in attempts. Try again later.", undefined, {
        headers: { "Retry-After": String(limit.retryAfterSec) },
      });
    }
    const parsed = loginSchema.safeParse(await readJson(req, 5_000));
    if (!parsed.success) return validationError(parsed.error);

    const prisma = getPrisma();
    const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
    const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? (await getDummyHash()));
    if (!user || !ok) {
      logger.warn("Failed admin login", { email: parsed.data.email });
      return jsonError(401, "INVALID_CREDENTIALS", "Incorrect email or password.");
    }
    await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSessionCookie(user);
    return NextResponse.json({ data: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return handleUnknownError(err, req);
  }
}
