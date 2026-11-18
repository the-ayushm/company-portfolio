import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.brand.name} — Engineering digital experiences that move businesses forward`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "radial-gradient(70% 90% at 85% 10%, rgba(109,124,255,0.45), transparent 60%), radial-gradient(60% 70% at 0% 100%, rgba(167,123,255,0.3), transparent 60%), #08090d",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg,#6d7cff,#a77bff)" }} />
          {siteConfig.brand.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3, fontWeight: 600, maxWidth: 1000 }}>
            Engineering digital experiences that move businesses forward.
          </div>
          <div style={{ fontSize: 28, color: "#969ba8" }}>Custom Software · ERP & CRM · WhatsApp Automation · E-commerce</div>
        </div>
      </div>
    ),
    size,
  );
}
