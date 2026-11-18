import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight } from "lucide-react";
import { getPrisma } from "@/lib/db/prisma";
import { statusMeta } from "@/components/admin/inquiry-status";
import { Badge, PageTitle } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";
import { isEmailConfigured } from "@/lib/email/notify";

export default async function AdminDashboard() {
  await connection();
  const prisma = getPrisma();
  const [byStatus, recent, projects, noScreens, testimonials, approved, team] = await Promise.all([
    prisma.contactInquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, fullName: true, projectType: true, status: true, createdAt: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { coverImage: null, images: { none: {} } } }),
    prisma.testimonial.count({ where: { isPlaceholder: true, published: true } }),
    prisma.testimonial.count({ where: { clientApproved: true, published: true, isPlaceholder: false } }),
    prisma.teamMember.count({ where: { OR: [{ role: null }, { bio: null }, { photoUrl: null }] } }),
  ]);
  const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])) as Record<string, number>;
  const totalInquiries = Object.values(counts).reduce((a, b) => a + b, 0);

  const checklist = [
    { done: siteConfig.brand.name !== "Studio Three", text: "Set the final brand name (NEXT_PUBLIC_BRAND_NAME)" },
    { done: team === 0, text: "Complete team roles, bios and photos", href: "/admin/team" },
    { done: noScreens === 0, text: `Upload real screenshots (${noScreens} project${noScreens === 1 ? "" : "s"} without)`, href: "/admin/projects" },
    { done: approved > 0, text: "Add at least one client-approved testimonial", href: "/admin/testimonials" },
    { done: testimonials === 0 || !siteConfig.showPlaceholderTestimonials, text: "Remove or hide sample testimonials before launch", href: "/admin/testimonials" },
    { done: !siteConfig.showContentPlaceholders, text: "Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=false at launch" },
    { done: isEmailConfigured(), text: "Configure SMTP for inquiry email notifications (optional)" },
    { done: !siteConfig.contactEmail.endsWith("yourdomain.com"), text: "Set the public contact email", href: "/admin/settings" },
  ];

  return (
    <div>
      <PageTitle title="Dashboard" description="Overview of inquiries and content readiness." />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="All inquiries" value={totalInquiries} href="/admin/inquiries" />
        {(Object.keys(statusMeta) as (keyof typeof statusMeta)[]).map((s) => (
          <Stat key={s} label={statusMeta[s].label} value={counts[s] ?? 0} href="/admin/inquiries" />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="text-sm font-medium">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-fg-2 hover:text-fg">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-fg-2">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((i) => (
                <li key={i.id}>
                  <Link href={`/admin/inquiries/${i.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{i.fullName}</span>
                      <span className="block truncate text-xs text-fg-2">{i.projectType} · {formatDateTime(i.createdAt)}</span>
                    </span>
                    <Badge tone={statusMeta[i.status].tone}>{statusMeta[i.status].label}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="text-sm font-medium">Launch checklist</h2>
          <p className="mt-1 text-xs text-fg-3">{projects} projects in the database.</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {checklist.map((c) => (
              <li key={c.text} className="flex items-start gap-2.5 text-sm">
                <span className={`mt-1 size-2 shrink-0 rounded-full ${c.done ? "bg-success" : "bg-warning"}`} aria-hidden />
                <span className={c.done ? "text-fg-3 line-through" : "text-fg-2"}>
                  {c.href && !c.done ? <Link href={c.href} className="hover:text-fg hover:underline">{c.text}</Link> : c.text}
                </span>
                <span className="sr-only">{c.done ? "(done)" : "(to do)"}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="group rounded-xl border border-line bg-card p-4 transition-colors hover:border-line-strong">
      <span className="flex items-center justify-between text-xs text-fg-2">
        {label}
        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </span>
      <span className="mt-2 block text-2xl font-semibold tabular-nums">{value}</span>
    </Link>
  );
}
