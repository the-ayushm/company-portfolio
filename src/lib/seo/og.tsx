import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

/** Shared pieces for the Open Graph images (rendered by next/og). */

export async function ogFonts() {
  const dir = join(process.cwd(), "public/fonts");
  const [medium, regular, mono] = await Promise.all([
    readFile(join(dir, "Poppins-Medium.ttf")),
    readFile(join(dir, "Poppins-Regular.ttf")),
    readFile(join(dir, "JetBrainsMono-Medium.ttf")),
  ]);
  return [
    { name: "Poppins", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Poppins", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

export async function heroPoster(): Promise<string | null> {
  try {
    const data = await readFile(join(process.cwd(), "public/images/hero-blocks.png"), "base64");
    return `data:image/png;base64,${data}`;
  } catch {
    return null;
  }
}

export function OgLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", position: "relative", width: 64, height: 64, borderRadius: 19, background: "#0E2B24" }}>
        <div style={{ position: "absolute", left: 13, top: 13, width: 16, height: 38, borderRadius: 7, background: "#A9C8B4" }} />
        <div style={{ position: "absolute", left: 35, top: 13, width: 16, height: 16, borderRadius: 7, background: "#C7BEF0" }} />
        <div style={{ position: "absolute", left: 35, top: 35, width: 16, height: 16, borderRadius: 7, background: "#C6F432" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 46, fontWeight: 500, letterSpacing: -2.4, color: "#0E2B24", lineHeight: 1 }}>
          {siteConfig.brand.wordmark}
          <span style={{ color: "#C6F432" }}>.</span>
        </div>
        {siteConfig.brand.descriptor && (
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 12, letterSpacing: 5, color: "#5D6A65", marginTop: 6 }}>
            {siteConfig.brand.descriptor}
          </div>
        )}
      </div>
    </div>
  );
}

type FlatBlock = { title: string; top: string; side: string; w: number; h: number; x: number; y: number };

/** Front-on keycap blocks, used when no poster render is available. */
export function OgBlocks({ blocks }: { blocks: FlatBlock[] }) {
  return (
    <div style={{ display: "flex", position: "relative", width: 460, height: 420 }}>
      {blocks.map((b) => (
        <div
          key={b.title}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            borderRadius: 26,
            background: b.top,
            boxShadow: `0 14px 0 ${b.side}, 0 30px 40px rgba(0,0,0,0.35)`,
            display: "flex",
            alignItems: "flex-end",
            padding: 18,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -1,
            color: "#0E2B24",
          }}
        >
          {b.title}
        </div>
      ))}
    </div>
  );
}

export const pinePanel = {
  display: "flex",
  position: "relative" as const,
  overflow: "hidden" as const,
  borderRadius: 40,
  background: "radial-gradient(120% 90% at 55% 40%, #1B463B 0%, #0E2B24 60%, #0A211B 100%)",
  alignItems: "center",
  justifyContent: "center",
};
