import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjects } from "@/lib/data/content";
import { modulesFor } from "@/config/blocks";
import { clay } from "@/components/ui/iso-block";
import { OgBlocks, OgLogo, ogFonts, pinePanel } from "@/lib/seo/og";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = await ogFonts();

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  const mods = modulesFor(p?.visual ?? "generic").slice(0, 3);
  const pos = [
    { x: 20, y: 30 },
    { x: 20, y: 215 },
    { x: 195, y: 215 },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3F2EE", padding: 40, gap: 40, fontFamily: "Poppins" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560, padding: "16px 0 16px 16px" }}>
          <OgLogo />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 15, letterSpacing: 1.2, color: "#5D6A65", textTransform: "uppercase" }}>
              Case study · {p?.category ?? "Project"}
            </div>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 500, lineHeight: 1.02, letterSpacing: -3, color: "#0E2B24" }}>{p?.title ?? "Our work"}</div>
            <div style={{ display: "flex", fontSize: 22, lineHeight: 1.45, color: "#4F5E58" }}>{p ? (p.summary.length > 130 ? `${p.summary.slice(0, 130).replace(/\s+\S*$/, "")}…` : p.summary) : ""}</div>
          </div>
        </div>
        <div style={{ ...pinePanel, flex: 1 }}>
          <OgBlocks
            blocks={[
              ...mods.map((m, i) => ({ title: m.title, top: clay[m.color].top, side: clay[m.color].side, w: 160, h: 150, ...pos[i]! })),
              { title: "Automated", top: "#C6F432", side: "#8FB514", w: 200, h: 150, x: 205, y: 30 },
            ]}
          />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
