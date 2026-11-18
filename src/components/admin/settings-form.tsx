"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/components/admin/api-client";
import { AdminButton, FieldWrap, inputClass, Notice, PageTitle } from "@/components/admin/ui";

type Settings = { availableForProjects: boolean; availabilityText: string; contactEmail: string | null };

export function SettingsForm() {
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "danger"; text: string } | null>(null);

  useEffect(() => {
    api<{ data: Settings }>("/api/admin/settings").then((r) => setS(r.data)).catch((e) => setMsg({ tone: "danger", text: e.message }));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!s) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ data: Settings }>("/api/admin/settings", { method: "PUT", json: s });
      setS(r.data);
      setMsg({ tone: "success", text: "Settings saved — the public site updates on the next visit." });
    } catch (err) {
      setMsg({ tone: "danger", text: err instanceof ApiError ? err.message : "Save failed" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageTitle title="Settings" description="Site-wide settings editable without a deploy." />
      {!s ? (
        <div className="h-48 animate-pulse rounded-xl bg-white/[0.02]" />
      ) : (
        <form onSubmit={save} className="flex max-w-xl flex-col gap-5 rounded-xl border border-line bg-card p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-1 size-4 accent-[var(--accent)]" checked={s.availableForProjects} onChange={(e) => setS({ ...s, availableForProjects: e.target.checked })} />
            <span>
              <span className="block text-sm font-medium">Show availability badge in the hero</span>
              <span className="block text-xs text-fg-3">Turn off when the team doesn&apos;t have capacity for new projects.</span>
            </span>
          </label>
          <FieldWrap label="Availability text" htmlFor="availabilityText">
            <input id="availabilityText" className={inputClass} value={s.availabilityText} onChange={(e) => setS({ ...s, availabilityText: e.target.value })} />
          </FieldWrap>
          <FieldWrap label="Public contact email" htmlFor="contactEmail" hint="Shown on the site. Falls back to NEXT_PUBLIC_CONTACT_EMAIL.">
            <input id="contactEmail" type="email" className={inputClass} value={s.contactEmail ?? ""} onChange={(e) => setS({ ...s, contactEmail: e.target.value })} />
          </FieldWrap>
          {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
          <div className="flex justify-end">
            <AdminButton type="submit" loading={busy}>Save settings</AdminButton>
          </div>
        </form>
      )}
    </div>
  );
}
