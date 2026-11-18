import { after, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { getPrisma } from "@/lib/db/prisma";
import { clientIp, hashIp, rateLimit } from "@/lib/security/rate-limit";
import { sanitizeText } from "@/lib/utils/sanitize";
import { handleUnknownError, isSameOrigin, jsonError, readJson, validationError } from "@/lib/api/http";
import { notifyNewInquiry } from "@/lib/email/notify";
import { logger } from "@/lib/utils/logger";

/** Submissions faster than this after the form rendered are treated as bots. */
const MIN_FILL_MS = 3000;

/**
 * POST /api/contact — stores a project inquiry.
 * 201 { ok, id } | 422 validation | 429 rate limited | 403 cross-origin | 500
 */
export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req)) return jsonError(403, "FORBIDDEN", "Cross-origin request rejected.");

    const ip = clientIp(req.headers);
    const limit = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
    if (!limit.ok) {
      return jsonError(429, "RATE_LIMITED", "Too many submissions. Please try again in a few minutes.", undefined, {
        headers: { "Retry-After": String(limit.retryAfterSec) },
      });
    }

    const body = (await readJson(req, 20_000)) as Record<string, unknown>;

    // Spam traps: respond as if successful so bots learn nothing, but store nothing.
    const honeypot = typeof body?.website === "string" && body.website.trim() !== "";
    const startedAt = Number(body?.startedAt);
    const tooFast = Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS;
    if (honeypot || tooFast) {
      logger.warn("Contact submission dropped as spam", { reason: honeypot ? "honeypot" : "too-fast" });
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const d = parsed.data;

    const inquiry = await getPrisma().contactInquiry.create({
      data: {
        fullName: sanitizeText(d.fullName),
        email: d.email,
        phone: d.phone ? sanitizeText(d.phone) : null,
        companyName: d.companyName ? sanitizeText(d.companyName) : null,
        projectType: d.projectType,
        estimatedBudget: d.estimatedBudget,
        projectTimeline: d.projectTimeline,
        description: sanitizeText(d.description, { multiline: true }),
        consent: d.consent,
        ipHash: await hashIp(ip),
        userAgent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      },
    });

    logger.info("New contact inquiry", { id: inquiry.id, projectType: inquiry.projectType });
    // Email after responding so SMTP latency never slows the form.
    after(() => notifyNewInquiry(inquiry));

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    return handleUnknownError(err, req);
  }
}
