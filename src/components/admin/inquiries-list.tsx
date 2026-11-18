"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { api } from "@/components/admin/api-client";
import { Badge, inputClass, Notice, PageTitle } from "@/components/admin/ui";
import { statusMeta, type Inquiry } from "@/components/admin/inquiry-status";
import { inquiryStatuses, type InquiryStatusValue } from "@/lib/validations/admin";
import { budgetOptions, labelFor } from "@/config/contact";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type ListResponse = { data: Inquiry[]; meta: { total: number; page: number; pages: number }; counts: Partial<Record<InquiryStatusValue, number>> };

export function InquiriesList() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<InquiryStatusValue | "">("");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<(ListResponse & { key: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (debounced) params.set("q", debounced);
  if (status) params.set("status", status);
  const key = params.toString();
  const loading = res?.key !== key;

  useEffect(() => {
    let cancelled = false;
    api<ListResponse>(`/api/admin/inquiries?${key}`)
      .then((r) => {
        if (cancelled) return;
        setRes({ ...r, key });
        setError(null);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [key]);

  const total = res ? Object.values(res.counts).reduce((a, b) => a + (b ?? 0), 0) : 0;

  return (
    <div>
      <PageTitle title="Inquiries" description="Project inquiries submitted through the contact form." />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by status">
          {([["", `All (${total})`], ...inquiryStatuses.map((s) => [s, `${statusMeta[s].label} (${res?.counts[s] ?? 0})`])] as [string, string][]).map(([value, label]) => (
            <button
              key={value || "all"}
              role="tab"
              aria-selected={status === value}
              onClick={() => {
                setStatus(value as InquiryStatusValue | "");
                setPage(1);
              }}
              className={cn("rounded-full border px-3 py-1 text-xs transition-colors", status === value ? "border-fg bg-fg text-bg" : "border-line text-fg-2 hover:border-line-strong")}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-3" aria-hidden />
          <input
            className={cn(inputClass, "pl-9")}
            placeholder="Search name, email, company…"
            aria-label="Search inquiries"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {error && <div className="mb-4"><Notice>{error}</Notice></div>}

      <div className={cn("overflow-hidden rounded-xl border border-line transition-opacity", loading && "opacity-60")}>
        <div className="hidden grid-cols-[1.4fr_1.2fr_1fr_0.9fr_0.8fr] gap-4 border-b border-line bg-card px-4 py-2.5 text-xs font-medium text-fg-3 md:grid">
          <span>Contact</span>
          <span>Project</span>
          <span>Budget</span>
          <span>Received</span>
          <span>Status</span>
        </div>
        {res && res.data.length === 0 && <p className="p-10 text-center text-sm text-fg-2">No inquiries found.</p>}
        <ul className="divide-y divide-line">
          {res?.data.map((i) => (
            <li key={i.id}>
              <Link href={`/admin/inquiries/${i.id}`} className="grid gap-1 px-4 py-3 transition-colors hover:bg-card md:grid-cols-[1.4fr_1.2fr_1fr_0.9fr_0.8fr] md:items-center md:gap-4">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{i.fullName}</span>
                  <span className="block truncate text-xs text-fg-2">{i.email}{i.companyName ? ` · ${i.companyName}` : ""}</span>
                </span>
                <span className="truncate text-sm text-fg-2">{i.projectType}</span>
                <span className="text-sm text-fg-2">{labelFor(budgetOptions, i.estimatedBudget)}</span>
                <span className="text-xs text-fg-3">{formatDateTime(i.createdAt)}</span>
                <span><Badge tone={statusMeta[i.status].tone}>{statusMeta[i.status].label}</Badge></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {res && res.meta.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-fg-2">
          <span>
            Page {res.meta.page} of {res.meta.pages} · {res.meta.total} results
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-line p-2 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="size-4" /></button>
            <button disabled={page >= res.meta.pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-line p-2 disabled:opacity-40" aria-label="Next page"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
