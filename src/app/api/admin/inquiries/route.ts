import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { validationError, withAdmin } from "@/lib/api/http";
import { inquiryQuerySchema } from "@/lib/validations/admin";

/**
 * GET /api/admin/inquiries?q=&status=&page=&pageSize=
 * Search (name, email, company, phone, description), filter by status, paginate (newest first).
 */
export const GET = withAdmin(async (req) => {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = inquiryQuerySchema.safeParse({
    ...params,
    status: params.status || undefined,
    q: params.q || undefined,
  });
  if (!parsed.success) return validationError(parsed.error);
  const { q, status, page, pageSize } = parsed.data;

  const where: Prisma.ContactInquiryWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const prisma = getPrisma();
  const [total, data, counts] = await Promise.all([
    prisma.contactInquiry.count({ where }),
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      omit: { ipHash: true, userAgent: true },
    }),
    prisma.contactInquiry.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  return NextResponse.json({
    data,
    meta: { total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) },
    counts: Object.fromEntries(counts.map((c) => [c.status, c._count._all])),
  });
});
