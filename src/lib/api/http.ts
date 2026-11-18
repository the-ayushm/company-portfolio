import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin, type AdminIdentity } from "@/lib/auth/session";
import { errorMeta, logger } from "@/lib/utils/logger";

export type ApiErrorBody = {
  error: { code: string; message: string; fields?: Record<string, string[]> };
};

export function jsonError(status: number, code: string, message: string, fields?: Record<string, string[]>, init?: ResponseInit) {
  return NextResponse.json<ApiErrorBody>({ error: { code, message, ...(fields ? { fields } : {}) } }, { status, ...init });
}

export function validationError(err: z.ZodError) {
  const fields: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    (fields[key] ??= []).push(issue.message);
  }
  return jsonError(422, "VALIDATION_ERROR", "Some fields are invalid.", fields);
}

export async function readJson(req: Request, maxBytes = 200_000): Promise<unknown> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > maxBytes) throw new PayloadTooLarge();
  const text = await req.text();
  if (text.length > maxBytes) throw new PayloadTooLarge();
  return text ? JSON.parse(text) : {};
}

export class PayloadTooLarge extends Error {}

/** Rejects cross-site mutating requests (defence in depth on top of SameSite cookies). */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches from older browsers / server tools
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

type AdminHandler<C> = (req: Request, ctx: C, admin: AdminIdentity) => Promise<Response>;

/** Wraps an admin route handler with auth, CSRF origin check and error handling. */
export function withAdmin<C>(handler: AdminHandler<C>) {
  return async (req: Request, ctx: C): Promise<Response> => {
    try {
      if (req.method !== "GET" && !isSameOrigin(req)) {
        return jsonError(403, "FORBIDDEN", "Cross-origin request rejected.");
      }
      const admin = await getCurrentAdmin();
      if (!admin) return jsonError(401, "UNAUTHORIZED", "Please sign in.");
      return await handler(req, ctx, admin);
    } catch (err) {
      return handleUnknownError(err, req);
    }
  };
}

export function handleUnknownError(err: unknown, req: Request) {
  if (err instanceof PayloadTooLarge) return jsonError(413, "PAYLOAD_TOO_LARGE", "Request body is too large.");
  if (err instanceof SyntaxError) return jsonError(400, "INVALID_JSON", "Request body must be valid JSON.");
  if (err instanceof z.ZodError) return validationError(err);
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return jsonError(409, "CONFLICT", "A record with this unique value already exists.");
  if (code === "P2025") return jsonError(404, "NOT_FOUND", "Record not found.");
  logger.error("Unhandled API error", { path: new URL(req.url).pathname, method: req.method, ...errorMeta(err) });
  return jsonError(500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
}
