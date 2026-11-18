import { useId } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Original animated line-art glyphs for each service. Pure SVG + CSS (no JS),
 * so they're cheap to render and respect prefers-reduced-motion via globals.css.
 */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function ServiceGlyph({ icon, className, active = true }: { icon: string; className?: string; active?: boolean }) {
  const gid = `glyph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 200 200" className={cn("glyph", active && "glyph-active", className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
        </linearGradient>
      </defs>
      {renderGlyph(icon, `url(#${gid})`)}
    </svg>
  );
}

function renderGlyph(icon: string, grad: string) {
  switch (icon) {
    case "erp":
      // Interlocking modules
      return (
        <g {...stroke}>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={40 + c * 42} y={40 + r * 42} width="34" height="34" rx="6" className="glyph-pulse" style={{ animationDelay: `${(r + c) * 0.18}s` }} opacity={0.35 + ((r + c) % 3) * 0.2} />
            )),
          )}
          <path d="M57 74 V82 M99 74 V82 M141 116 V124 M74 99 H82 M116 141 H124" stroke={grad} strokeWidth="2" />
          <rect x="82" y="82" width="34" height="34" rx="6" stroke={grad} strokeWidth="2" />
        </g>
      );
    case "crm":
      // Pipeline / funnel of contacts
      return (
        <g {...stroke}>
          <path d="M30 50 H170 L128 110 V160 L72 140 V110 Z" opacity="0.5" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={52 + i * 24} cy="38" r="7" className="glyph-drop" style={{ animationDelay: `${i * 0.35}s` }} stroke={grad} />
          ))}
          <circle cx="100" cy="128" r="10" stroke={grad} strokeWidth="2" />
        </g>
      );
    case "whatsapp":
      // Conversation bubbles + automation path
      return (
        <g {...stroke}>
          <path d="M40 60 a20 20 0 0 1 20 -20 h60 a20 20 0 0 1 20 20 v20 a20 20 0 0 1 -20 20 h-46 l-22 16 v-16 a20 20 0 0 1 -12 -18 z" opacity="0.55" />
          <path d="M160 110 a16 16 0 0 0 -16 -16 h-50 a16 16 0 0 0 -16 16 v18 a16 16 0 0 0 16 16 h36 l20 14 v-14 a16 16 0 0 0 10 -14 z" stroke={grad} strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={104 + i * 14} cy="119" r="3" fill="currentColor" className="glyph-blink" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
          <path d="M60 60 h50 M60 74 h34" opacity="0.6" />
        </g>
      );
    case "ecommerce":
      // Product cards + cart path
      return (
        <g {...stroke}>
          <rect x="34" y="40" width="58" height="76" rx="8" opacity="0.5" />
          <rect x="108" y="40" width="58" height="76" rx="8" opacity="0.5" />
          <circle cx="63" cy="68" r="14" opacity="0.6" />
          <circle cx="137" cy="68" r="14" opacity="0.6" />
          <path d="M44 100 h30 M118 100 h30" />
          <path d="M60 140 h14 l10 28 h56 l10 -22 h-72" stroke={grad} strokeWidth="2" className="glyph-draw" />
          <circle cx="92" cy="178" r="4" /> <circle cx="132" cy="178" r="4" />
        </g>
      );
    case "shopify":
      // Storefront bag
      return (
        <g {...stroke}>
          <path d="M50 70 h100 l-8 100 h-84 z" stroke={grad} strokeWidth="2" />
          <path d="M76 70 v-12 a24 24 0 0 1 48 0 v12" />
          <path d="M70 110 h60 M74 130 h52" opacity="0.5" className="glyph-draw" />
          <circle cx="100" cy="150" r="5" className="glyph-blink" fill="currentColor" />
        </g>
      );
    case "ai":
      // Neural lattice
      return (
        <g {...stroke}>
          {[
            [40, 60], [40, 100], [40, 140],
            [100, 45], [100, 85], [100, 125], [100, 165],
            [160, 80], [160, 120],
          ].map(([x, y], i, all) => (
            <g key={i}>
              {i < 3 && all.slice(3, 7).map(([x2, y2], j) => <line key={j} x1={x} y1={y} x2={x2} y2={y2} opacity="0.25" />)}
              {i >= 3 && i < 7 && all.slice(7).map(([x2, y2], j) => <line key={j} x1={x} y1={y} x2={x2} y2={y2} opacity="0.25" />)}
            </g>
          ))}
          {[
            [40, 60], [40, 100], [40, 140], [100, 45], [100, 85], [100, 125], [100, 165], [160, 80], [160, 120],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill="var(--bg)" stroke={i > 6 ? grad : "currentColor"} className="glyph-blink" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </g>
      );
    case "api":
      // Layered services + endpoints
      return (
        <g {...stroke}>
          <ellipse cx="100" cy="60" rx="56" ry="16" stroke={grad} strokeWidth="2" />
          <path d="M44 60 v34 a56 16 0 0 0 112 0 v-34" opacity="0.6" />
          <path d="M44 94 v34 a56 16 0 0 0 112 0 v-34" opacity="0.35" />
          <path d="M100 150 v26 M70 176 h60" />
          <circle cx="70" cy="176" r="4" className="glyph-blink" /> <circle cx="130" cy="176" r="4" className="glyph-blink" style={{ animationDelay: ".4s" }} />
        </g>
      );
    case "code":
    default:
      // Window + brackets
      return (
        <g {...stroke}>
          <rect x="28" y="40" width="144" height="120" rx="12" opacity="0.5" />
          <path d="M28 62 h144" opacity="0.5" />
          <circle cx="42" cy="51" r="3" /> <circle cx="54" cy="51" r="3" /> <circle cx="66" cy="51" r="3" />
          <path d="M80 92 l-18 18 l18 18 M120 92 l18 18 l-18 18" stroke={grad} strokeWidth="2" />
          <path d="M108 86 l-16 48" className="glyph-draw" />
        </g>
      );
  }
}
