import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getProjectBySlug, getProjects } from "@/lib/data/content";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  const accent = p?.accent ?? "#6d7cff";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `radial-gradient(70% 90% at 90% 0%, ${accent}66, transparent 60%), #08090d`,
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#969ba8" }}>{siteConfig.brand.name} — Case study</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, color: accent, textTransform: "uppercase", letterSpacing: 4 }}>{p?.category ?? "Project"}</div>
          <div style={{ fontSize: 110, lineHeight: 1, letterSpacing: -4, fontWeight: 600 }}>{p?.title ?? "Our work"}</div>
          <div style={{ fontSize: 30, color: "#969ba8", maxWidth: 1000 }}>{p?.summary.slice(0, 140) ?? ""}</div>
        </div>
      </div>
    ),
    size,
  );
}
