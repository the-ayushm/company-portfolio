"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImage, ApiError } from "@/components/admin/api-client";
import { inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils/cn";

/** Newline-separated list editor → string[] */
export function ListInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <textarea
      id={id}
      rows={Math.min(10, Math.max(3, value.length + 1))}
      className={cn(inputClass, "font-mono text-xs")}
      placeholder={placeholder ?? "One item per line"}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
    />
  );
}

/** Single image: URL field + upload button + preview. */
export function ImageInput({ id, value, onChange }: { id: string; value: string | null; onChange: (v: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white/[0.03]">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-5 text-fg-3" aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <input id={id} className={inputClass} placeholder="/uploads/… or https://…" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1 text-xs hover:bg-white/[0.05]" disabled={busy}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />} Upload
          </button>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-xs text-fg-3 hover:text-danger">
              Remove
            </button>
          )}
          {error && <span className="text-xs text-danger">{error}</span>}
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}

export type GalleryImage = { url: string; alt: string; caption: string | null };

/** Ordered gallery editor with multi-upload. */
export function GalleryInput({ value, onChange }: { value: GalleryImage[]; onChange: (v: GalleryImage[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    const added: GalleryImage[] = [];
    try {
      for (const f of Array.from(files)) added.push({ url: await uploadImage(f), alt: "", caption: null });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Upload failed");
    } finally {
      onChange([...value, ...added]);
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const update = (i: number, patch: Partial<GalleryImage>) => onChange(value.map((img, j) => (j === i ? { ...img, ...patch } : img)));
  const move = (i: number, d: number) => {
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.splice(i + d, 0, item!);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {value.map((img, i) => (
        <div key={`${img.url}-${i}`} className="flex gap-3 rounded-lg border border-line p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} alt="" className="h-16 w-24 shrink-0 rounded-md object-cover" />
          <div className="flex flex-1 flex-col gap-2">
            <input className={inputClass} placeholder="Alt text (describe the screenshot)" value={img.alt} onChange={(e) => update(i, { alt: e.target.value })} />
            <input className={inputClass} placeholder="Caption (optional)" value={img.caption ?? ""} onChange={(e) => update(i, { caption: e.target.value || null })} />
          </div>
          <div className="flex flex-col gap-1">
            <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-fg-2 hover:bg-white/5 disabled:opacity-30"><ArrowUp className="size-3.5" /></button>
            <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-fg-2 hover:bg-white/5 disabled:opacity-30"><ArrowDown className="size-3.5" /></button>
            <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded p-1 text-fg-2 hover:bg-danger/10 hover:text-danger"><Trash2 className="size-3.5" /></button>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-3 py-2 text-sm text-fg-2 hover:border-fg/40 hover:text-fg">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />} Add screenshots
        </button>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
      <input ref={fileRef} type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif,image/gif" className="hidden" onChange={(e) => add(e.target.files)} />
    </div>
  );
}
