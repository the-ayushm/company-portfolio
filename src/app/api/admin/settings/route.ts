import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { readJson, validationError, withAdmin } from "@/lib/api/http";
import { invalidateContent } from "@/lib/api/crud";
import { settingsSchema } from "@/lib/validations/admin";

export const GET = withAdmin(async () => {
  const data = await getPrisma().siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return NextResponse.json({ data });
});

export const PUT = withAdmin(async (req) => {
  const parsed = settingsSchema.safeParse(await readJson(req));
  if (!parsed.success) return validationError(parsed.error);
  const data = await getPrisma().siteSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  invalidateContent();
  return NextResponse.json({ data });
});
