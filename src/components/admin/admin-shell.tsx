"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BriefcaseBusiness, ExternalLink, HelpCircle, Inbox, LayoutDashboard, Layers, LogOut, Menu, MessageSquareQuote, Settings, Share2, X } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { api } from "@/components/admin/api-client";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox },
  { href: "/admin/projects", label: "Projects", Icon: BriefcaseBusiness },
  { href: "/admin/services", label: "Services", Icon: Layers },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQ", Icon: HelpCircle },
  { href: "/admin/social-links", label: "Social links", Icon: Share2 },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminShell({ admin, children }: { admin: { name: string; email: string }; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await api("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
        <LogoMark className="size-6" />
        <span className="text-sm font-semibold">Admin</span>
      </Link>
      <nav aria-label="Admin" className="flex-1 px-3">
        <ul className="flex flex-col gap-0.5">
          {nav.map(({ href, label, Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-white/[0.07] text-fg" : "text-fg-2 hover:bg-white/[0.04] hover:text-fg")}
                >
                  <Icon className="size-4" aria-hidden /> {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-2 hover:bg-white/[0.04] hover:text-fg">
          <ExternalLink className="size-4" /> View site
        </a>
        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{admin.name}</p>
            <p className="truncate text-xs text-fg-3">{admin.email}</p>
          </div>
          <button onClick={logout} aria-label="Sign out" className="rounded-md p-1.5 text-fg-2 hover:bg-white/5 hover:text-fg">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-bg-2 lg:block">{sidebar}</aside>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2"><LogoMark className="size-6" /><span className="text-sm font-semibold">Admin</span></Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 hover:bg-white/5"><Menu className="size-5" /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-bg-2">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-4 rounded-md p-1.5 hover:bg-white/5"><X className="size-4" /></button>
            {sidebar}
          </aside>
        </div>
      )}
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
