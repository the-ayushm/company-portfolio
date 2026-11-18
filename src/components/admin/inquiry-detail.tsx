"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { api } from "@/components/admin/api-client";
import { AdminButton, Badge, inputClass, Notice } from "@/components/admin/ui";
import { statusMeta, type Inquiry } from "@/components/admin/inquiry-status";
import { inquiryStatuses } from "@/lib/validations/admin";
import { budgetOptions, labelFor, timelineOptions } from "@/config/contact";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function InquiryDetail({ id }: { id: string }) {
  const router = useRouter();
  const [inq, setInq] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ data: Inquiry }>(`/api/admin/inquiries/${id}`)
      .then((r) => {
        setInq(r.data);
        setNotes(r.data.adminNotes ?? "");
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const update = async (patch: Partial<Pick<Inquiry, "status" | "adminNotes">>, message: string) => {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ data: Inquiry }>(`/api/admin/inquiries/${id}`, { method: "PATCH", json: patch });
      setInq(r.data);
      setSaved(message);
      setTimeout(() => setSaved(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Permanently delete this inquiry? Use this for data deletion requests.")) return;
    await api(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    router.push("/admin/inquiries");
  };

  if (error && !inq) return <Notice>{error}</Notice>;
  if (!inq) return <div className="h-64 animate-pulse rounded-xl bg-white/[0.02]" />;

  const waNumber = inq.phone?.replace(/[^\d]/g, "");

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">
        <ArrowLeft className="size-4" /> All inquiries
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">{inq.fullName}</h1>
          <p className="mt-1 text-sm text-fg-2">
            {inq.companyName ?? "No company"} · received {formatDateTime(inq.createdAt)}
          </p>
        </div>
        <Badge tone={statusMeta[inq.status].tone}>{statusMeta[inq.status].label}</Badge>
      </div>

      {error && <Notice>{error}</Notice>}
      {saved && <Notice tone="success">{saved}</Notice>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-line bg-card p-5">
            <h2 className="mb-4 text-sm font-medium text-fg-2">Project</h2>
            <dl className="grid gap-4 sm:grid-cols-3">
              <Item label="Type">{inq.projectType}</Item>
              <Item label="Budget">{labelFor(budgetOptions, inq.estimatedBudget)}</Item>
              <Item label="Timeline">{labelFor(timelineOptions, inq.projectTimeline)}</Item>
            </dl>
            <p className="mt-5 whitespace-pre-wrap border-t border-line pt-5 text-sm leading-relaxed">{inq.description}</p>
          </section>

          <section className="rounded-xl border border-line bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-fg-2">Internal notes</h2>
            <textarea className={inputClass} rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call notes, next steps…" aria-label="Internal notes" />
            <div className="mt-3 flex justify-end">
              <AdminButton loading={busy} onClick={() => update({ adminNotes: notes }, "Notes saved")}>Save notes</AdminButton>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-line bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-fg-2">Status</h2>
            <div className="grid grid-cols-2 gap-2">
              {inquiryStatuses.map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => s !== inq.status && update({ status: s }, `Marked as ${statusMeta[s].label}`)}
                  aria-pressed={inq.status === s}
                  className={cn("rounded-lg border px-3 py-2 text-sm transition-colors", inq.status === s ? "border-fg bg-fg text-bg" : "border-line text-fg-2 hover:border-line-strong hover:text-fg")}
                >
                  {statusMeta[s].label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-fg-2">Contact</h2>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`mailto:${inq.email}`} className="flex items-center gap-2 hover:text-accent"><Mail className="size-4 text-fg-3" /> {inq.email}</a>
              {inq.phone && <a href={`tel:${inq.phone}`} className="flex items-center gap-2 hover:text-accent"><Phone className="size-4 text-fg-3" /> {inq.phone}</a>}
              {waNumber && (
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent">
                  <MessageCircle className="size-4 text-fg-3" /> Open in WhatsApp
                </a>
              )}
            </div>
            <p className="mt-4 text-xs text-fg-3">Consent given: {inq.consent ? "Yes" : "No"}</p>
          </section>

          <AdminButton variant="danger" onClick={remove}><Trash2 className="size-4" /> Delete inquiry</AdminButton>
        </div>
      </div>
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-fg-3">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
