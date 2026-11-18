import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

/** Full session check (signature + DB token version) for every admin page. */
async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return <AdminShell admin={admin}>{children}</AdminShell>;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-sm text-fg-3">Loading admin…</div>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
