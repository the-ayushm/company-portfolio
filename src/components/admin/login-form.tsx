"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/layout/logo";
import { api, ApiError } from "@/components/admin/api-client";
import { AdminButton, FieldWrap, inputClass, Notice } from "@/components/admin/ui";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = params.get("next");
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/admin/auth/login", { method: "POST", json: { email, password } });
      router.replace(safeNext);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-line bg-card p-8 shadow-2xl">
      <LogoMark className="size-9" />
      <h1 className="mt-6 text-xl font-semibold tracking-[-0.02em]">Sign in to admin</h1>
      <p className="mt-1 text-sm text-fg-2">Authorised team members only.</p>
      <div className="mt-6 flex flex-col gap-4">
        <FieldWrap label="Email" htmlFor="email">
          <input id="email" type="email" autoComplete="username" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Password" htmlFor="password">
          <input id="password" type="password" autoComplete="current-password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </FieldWrap>
        {error && <Notice>{error}</Notice>}
        <AdminButton type="submit" loading={busy} className="mt-2 h-10">Sign in</AdminButton>
      </div>
    </form>
  );
}
