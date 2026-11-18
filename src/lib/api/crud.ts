import "server-only";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type { z } from "zod";
import { readJson, validationError, withAdmin, jsonError } from "@/lib/api/http";
import { CONTENT_TAG } from "@/lib/data/content";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Delegate = {
  findMany(args?: any): Promise<any[]>;
  findUnique(args: any): Promise<any | null>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  delete(args: any): Promise<any>;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

type IdCtx = { params: Promise<{ id: string }> };

/** Expire public content caches immediately after an admin write. */
export function invalidateContent() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
}

/**
 * Builds authenticated REST handlers for a simple content model:
 *   GET    /api/admin/<resource>        list
 *   POST   /api/admin/<resource>        create
 *   GET    /api/admin/<resource>/:id    read
 *   PUT    /api/admin/<resource>/:id    replace
 *   DELETE /api/admin/<resource>/:id    delete
 */
export function createCrud<S extends z.ZodType>(opts: {
  delegate: () => Delegate;
  schema: S;
  orderBy?: Record<string, "asc" | "desc">[];
}) {
  const orderBy = opts.orderBy ?? [{ order: "asc" }, { createdAt: "asc" }];

  const collection = {
    GET: withAdmin(async () => NextResponse.json({ data: await opts.delegate().findMany({ orderBy }) })),
    POST: withAdmin(async (req) => {
      const parsed = opts.schema.safeParse(await readJson(req));
      if (!parsed.success) return validationError(parsed.error);
      const row = await opts.delegate().create({ data: parsed.data });
      invalidateContent();
      return NextResponse.json({ data: row }, { status: 201 });
    }),
  };

  const item = {
    GET: withAdmin<IdCtx>(async (_req, ctx) => {
      const { id } = await ctx.params;
      const row = await opts.delegate().findUnique({ where: { id } });
      return row ? NextResponse.json({ data: row }) : jsonError(404, "NOT_FOUND", "Record not found.");
    }),
    PUT: withAdmin<IdCtx>(async (req, ctx) => {
      const { id } = await ctx.params;
      const parsed = opts.schema.safeParse(await readJson(req));
      if (!parsed.success) return validationError(parsed.error);
      const row = await opts.delegate().update({ where: { id }, data: parsed.data });
      invalidateContent();
      return NextResponse.json({ data: row });
    }),
    DELETE: withAdmin<IdCtx>(async (_req, ctx) => {
      const { id } = await ctx.params;
      await opts.delegate().delete({ where: { id } });
      invalidateContent();
      return new NextResponse(null, { status: 204 });
    }),
  };

  return { collection, item };
}
