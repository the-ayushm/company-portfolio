"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react";
import { api, ApiError } from "@/components/admin/api-client";
import { resources, formFromRow, type FieldDef, type ResourceConfig, type Row } from "@/components/admin/resource-configs";
import { AdminButton, Badge, FieldWrap, inputClass, Notice, PageTitle } from "@/components/admin/ui";
import { GalleryInput, ImageInput, ListInput, type GalleryImage } from "@/components/admin/fields";
import { cn } from "@/lib/utils/cn";

/** Generic list + slide-over editor for a content resource, backed by /api/admin/<resource>. */
export function ResourceManager({ resource }: { resource: keyof typeof resources }) {
  const cfg = resources[resource]!;
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown> } | null>(null);

  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    api<{ data: Row[] }>(cfg.endpoint)
      .then((res) => !cancelled && setRows(res.data))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"));
    return () => {
      cancelled = true;
    };
  }, [cfg.endpoint, reloadKey]);

  const remove = async (row: Row) => {
    if (!confirm(`Delete this ${cfg.singular}? This cannot be undone.`)) return;
    try {
      await api(`${cfg.endpoint}/${row.id}`, { method: "DELETE" });
      setRows((r) => r?.filter((x) => x.id !== row.id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <PageTitle
        title={cfg.title}
        description={cfg.description}
        actions={
          <AdminButton onClick={() => setEditing({ id: null, values: { ...cfg.defaults } })}>
            <Plus className="size-4" aria-hidden /> New {cfg.singular}
          </AdminButton>
        }
      />
      {error && <div className="mb-4"><Notice>{error}</Notice></div>}

      <div className="overflow-hidden rounded-xl border border-line">
        {rows === null ? (
          <div className="space-y-px">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse bg-white/[0.02]" />)}</div>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-fg-2">No {cfg.title.toLowerCase()} yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((row) => {
              const s = cfg.summary(row);
              return (
                <li key={row.id} className="flex items-center gap-4 bg-card/40 px-4 py-3 transition-colors hover:bg-card">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.primary}</p>
                    {s.secondary && <p className="truncate text-sm text-fg-2">{s.secondary}</p>}
                  </div>
                  <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                    {s.badges?.map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}
                  </div>
                  <div className="flex gap-1">
                    {cfg.publicHref && row.published && (
                      <a href={cfg.publicHref(row)} target="_blank" rel="noreferrer" aria-label="View on site" className="rounded-md p-2 text-fg-2 hover:bg-white/5 hover:text-fg">
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <button type="button" aria-label={`Edit ${s.primary}`} onClick={() => setEditing({ id: row.id, values: formFromRow(cfg, row) })} className="rounded-md p-2 text-fg-2 hover:bg-white/5 hover:text-fg">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${s.primary}`} onClick={() => remove(row)} className="rounded-md p-2 text-fg-2 hover:bg-danger/10 hover:text-danger">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <Editor
            key={editing.id ?? "new"}
            cfg={cfg}
            id={editing.id}
            initial={editing.values}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Editor({ cfg, id, initial, onClose, onSaved }: { cfg: ResourceConfig; id: string | null; initial: Record<string, unknown>; onClose: () => void; onSaved: () => void }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const set = (name: string, v: unknown) => setValues((s) => ({ ...s, [name]: v }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await api(id ? `${cfg.endpoint}/${id}` : cfg.endpoint, { method: id ? "PUT" : "POST", json: values });
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fields ?? {});
      } else setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.form
        onSubmit={save}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-bg-2"
        role="dialog"
        aria-modal="true"
        aria-label={`${id ? "Edit" : "New"} ${cfg.singular}`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-semibold capitalize">{id ? "Edit" : "New"} {cfg.singular}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 hover:bg-white/5"><X className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
          <div className="grid gap-5 sm:grid-cols-2">
            {cfg.fields.map((f) => (
              <div key={f.name} className={cn((f.full || f.type === "textarea" || f.type === "gallery") && "sm:col-span-2")}>
                <FieldControl field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} error={fieldErrors[f.name]?.[0]} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          <div className="min-w-0 flex-1">{error && <Notice>{error}</Notice>}</div>
          <AdminButton type="button" variant="ghost" onClick={onClose}>Cancel</AdminButton>
          <AdminButton type="submit" loading={saving}>Save</AdminButton>
        </div>
      </motion.form>
    </div>
  );
}

function ServicesPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [services, setServices] = useState<{ slug: string; title: string }[]>([]);
  useEffect(() => {
    api<{ data: { slug: string; title: string }[] }>("/api/admin/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);
  return (
    <div className="flex flex-wrap gap-1.5">
      {services.map((s) => {
        const on = value.includes(s.slug);
        return (
          <button key={s.slug} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== s.slug) : [...value, s.slug])} className={cn("rounded-full border px-2.5 py-1 text-xs transition-colors", on ? "border-accent bg-accent/15 text-fg" : "border-line text-fg-2 hover:border-line-strong")}>
            {s.title}
          </button>
        );
      })}
    </div>
  );
}

function FieldControl({ field: f, value, onChange, error }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void; error?: string }) {
  const id = `f-${f.name}`;
  const common = { id, "aria-invalid": Boolean(error) };
  let control: React.ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea {...common} rows={f.rows ?? 5} className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "number":
      control = <input {...common} type="number" className={inputClass} value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
      break;
    case "boolean":
      return (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3">
          <input id={id} type="checkbox" className="mt-0.5 size-4 accent-[var(--accent)]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span>
            <span className="block text-sm">{f.label}</span>
            {f.hint && <span className="block text-xs text-fg-3">{f.hint}</span>}
          </span>
        </label>
      );
    case "list":
      control = <ListInput id={id} value={(value as string[]) ?? []} onChange={onChange} />;
      break;
    case "image":
      control = <ImageInput id={id} value={(value as string) ?? null} onChange={onChange} />;
      break;
    case "gallery":
      control = <GalleryInput value={(value as GalleryImage[]) ?? []} onChange={onChange} />;
      break;
    case "services":
      control = <ServicesPicker value={(value as string[]) ?? []} onChange={onChange} />;
      break;
    case "select":
      control = (
        <select {...common} className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => <option key={o.value} value={o.value} className="bg-bg-2">{o.label}</option>)}
        </select>
      );
      break;
    case "color":
      control = (
        <div className="flex gap-2">
          <input type="color" aria-label={`${f.label} picker`} className="h-9 w-12 cursor-pointer rounded-lg border border-line bg-transparent" value={(value as string) ?? "#6d7cff"} onChange={(e) => onChange(e.target.value.toUpperCase())} />
          <input {...common} className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    default:
      control = <input {...common} className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <FieldWrap label={f.label} hint={f.hint} error={error} htmlFor={id}>
      {control}
    </FieldWrap>
  );
}
