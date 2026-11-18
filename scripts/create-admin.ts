/**
 * Create an admin user or reset an existing admin's password.
 * Resetting also signs that admin out everywhere (token version bump).
 *
 *   npm run admin:create -- --email you@company.com --password "a-long-password" [--name "Ayush"]
 *
 * Falls back to ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { pgConfig } from "../src/lib/db/connection";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = (arg("email") ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = arg("password") ?? process.env.ADMIN_PASSWORD ?? "";
  const name = arg("name") ?? process.env.ADMIN_NAME ?? "Admin";
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Provide a valid --email");
  if (password.length < 12) throw new Error("Password must be at least 12 characters");

  const prisma = new PrismaClient({ adapter: new PrismaPg(pgConfig(process.env.DATABASE_URL!)) });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.adminUser.upsert({
      where: { email },
      update: { passwordHash, name, tokenVersion: { increment: 1 } },
      create: { email, name, passwordHash },
    });
    console.log(`✓ Admin ready: ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
