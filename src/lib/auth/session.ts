import "server-only";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "./token";

export type AdminIdentity = { id: string; email: string; name: string };

export async function createSessionCookie(user: { id: string; tokenVersion: number }) {
  const token = await signSession({ sub: user.id, v: user.tokenVersion });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Full check: signature, expiry, and that the user still exists with the same token version. */
export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const jar = await cookies();
  const payload = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const user = await getPrisma().adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, tokenVersion: true },
  });
  if (!user || user.tokenVersion !== payload.v) return null;
  return { id: user.id, email: user.email, name: user.name };
}
