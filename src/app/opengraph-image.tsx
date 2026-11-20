import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { heroPoster, OgBlocks, OgLogo, ogFonts, pinePanel } from "@/lib/seo/og";

export const alt = `${siteConfig.brand.name} — We turn spreadsheets, chats & busywork into systems that run themselves.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = await ogFonts();
const poster = await heroPoster();

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3F2EE", padding: 40, gap: 40, fontFamily: "Poppins" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520, padding: "16px 0 16px 16px" }}>
          <OgLogo />
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontSize: 50, fontWeight: 500, lineHeight: 1.06, letterSpacing: -2.2, color: "#0E2B24" }}>
              {"We turn spreadsheets, chats & busywork into".split(" ").map((w) => (
                <span key={w} style={{ marginRight: 13 }}>
                  {w}
                </span>
              ))}
              {"systems that run themselves.".split(" ").map((w, i, all) => (
                <span
                  key={w}
                  style={{
                    paddingRight: i < all.length - 1 ? 13 : 2,
                    backgroundImage: "linear-gradient(transparent 62%, #C6F432 62%, #C6F432 94%, transparent 94%)",
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 15, letterSpacing: 1.2, color: "#5D6A65" }}>
              CUSTOM SOFTWARE · ERP · CRM · WHATSAPP AUTOMATION
            </div>
          </div>
        </div>
        <div style={{ ...pinePanel, flex: 1 }}>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser
            <img src={poster} alt="" width={600} height={437} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <OgBlocks
              blocks={[
                { title: "CRM", top: "#C7BEF0", side: "#968BCB", w: 150, h: 150, x: 30, y: 40 },
                { title: "Orders", top: "#F4B98A", side: "#CC8B5C", w: 150, h: 150, x: 30, y: 220 },
                { title: "Payroll", top: "#F6F5F1", side: "#BDBBB2", w: 150, h: 150, x: 200, y: 220 },
                { title: "Automated", top: "#C6F432", side: "#8FB514", w: 200, h: 150, x: 210, y: 40 },
              ]}
            />
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
