# NEXOR AUTOMATIONS — Website Redesign Brief ("Building Blocks" theme)

> **For Claude Code.** This is the approved visual direction for the full redesign of this repo
> (`the-ayushm/company-portfolio`). Follow it exactly. It replaces the current dark indigo/violet theme
> everywhere on the public site. Read `AGENTS.md` first — this is Next.js 16 with breaking changes; check
> `node_modules/next/dist/docs/` before writing Next-specific code.

---

## 0. TL;DR

- **Theme:** "Building Blocks". Light **porcelain** page, deep **pine-green** panels, **electric lime** = "automated / done", soft **clay** colours (sage, lilac, apricot) for business modules.
- **Big idea:** every part of a client's business (WhatsApp, CRM, Orders, Payroll, Stock, Reports) is a soft, rounded **3D block**. Nexor is the **lime core block** they all snap into.
- **Hero headline (fixed copy):** "We turn spreadsheets, chats & busywork into **systems that run themselves.**" The bold part gets the lime highlighter.
- **Hero visual:** the dark-green panel with the blocks must be **real WebGL 3D** (React Three Fiber, already installed), **animated**: the blocks fly in and snap together, float, send data pulses into the core, react to hover, mouse and scroll.
- **Personality:** clear, helpful, a little playful. Premium but approachable. Never dark-neon, never "generic AI", no robots.

---

## 1. Scope & ground rules

1. Redesign **every public page** under `src/app/(site)/` (home, services, work, work/[slug], about, contact, privacy, not-found) plus navbar, footer, page loader, OG images and `icon.svg`.
2. **Do not break** data, Prisma, API routes, admin auth, contact form submission, SEO/JSON-LD, sitemap or robots. Keep all content coming from `src/config/*` and `src/lib/data/content.ts`.
3. **Admin panel (`src/app/admin`)**: keep it working. It may stay dark, but it must not visually break when the root tokens switch to light. Scope its styles with an `.admin` wrapper class if needed.
4. Keep the existing tooling: Tailwind v4 (`@theme inline` in `globals.css`), `motion`, `gsap`, `lenis`, `@react-three/fiber`, `@react-three/drei`, `three`. **Add no new heavy dependencies.** If you need rounded geometry, use drei's `RoundedBox`.
5. Respect `prefers-reduced-motion` everywhere (the codebase already does in places; keep doing it).
6. Remove the current hero "system core" iridescent scene and the indigo/violet/cyan palette completely.

---

## 2. Colour system

### 2.1 Palette

| Token | Hex | Role |
|---|---|---|
| Porcelain | `#F3F2EE` | Page background |
| Porcelain 2 | `#EAE8E2` | Alternate section background, subtle fills |
| White | `#FFFFFF` | Cards, inputs, light surfaces |
| Pine | `#0E2B24` | Primary text, primary buttons, dark panels |
| Pine 2 | `#163A31` | Hover / raised surfaces on pine |
| Pine 3 | `#0A211B` | Deepest pine (panel edges, footer bottom) |
| Lime | `#C6F432` | Signature accent: "automated", success, highlights, CTA icons |
| Lime deep | `#8FB514` | Lime shadows/sides of lime 3D blocks, lime borders on light bg |
| Sage | `#A9C8B4` | Module block (WhatsApp, Stock) |
| Lilac | `#C7BEF0` | Module block (CRM / Leads) |
| Apricot | `#F4B98A` | Module block (Orders / Sales) |
| Muted text | `#5E6E68` | Secondary text |
| Faint text | `#8A9691` | Captions, mono labels |

### 2.2 Usage rules (important)

- **Proportions:** ~70% porcelain/white, ~20% pine, ≤7% clay colours, ≤3% lime.
- **Lime is a fill, never body text on light backgrounds.** It fails contrast on porcelain. Lime *text* is allowed **only on pine** (e.g. "● 6 BLOCKS CONNECTED").
- On light backgrounds, lime appears as: highlighter strokes behind headline words, pill fills with pine text, status dots, the small circle inside the primary button, and the dot in the "nexor." wordmark.
- Clay colours are for **3D blocks, illustrations, avatars, tags**, never for large backgrounds or text.
- Pine panels always use the radial-gradient treatment (see 4.4), never a flat fill.
- No pure black `#000` anywhere. The darkest colour is Pine 3.

### 2.3 Replace the tokens in `src/app/globals.css`

Keep the **variable names** so existing components keep compiling, but change the values and add the new ones:

```css
:root {
  --bg: #F3F2EE;
  --bg-2: #EAE8E2;
  --card: #FFFFFF;
  --card-2: #F8F7F3;
  --line: rgba(14, 43, 36, 0.10);
  --line-strong: rgba(14, 43, 36, 0.18);
  --fg: #0E2B24;
  --fg-2: #5E6E68;
  --fg-3: #8A9691;

  --accent: #C6F432;        /* lime — fills only on light bg */
  --accent-2: #8FB514;      /* lime deep */
  --signal: #C6F432;
  --success: #8FB514;
  --danger: #E5484D;
  --warning: #F4B98A;

  --pine: #0E2B24;
  --pine-2: #163A31;
  --pine-3: #0A211B;
  --lime: #C6F432;
  --lime-deep: #8FB514;
  --sage: #A9C8B4;
  --lilac: #C7BEF0;
  --apricot: #F4B98A;

  --radius-sm: 12px;
  --radius: 20px;
  --radius-lg: 28px;
  --radius-xl: 44px;        /* pine hero/feature panels */
  --radius-pill: 999px;

  --shadow-card: 0 1px 0 rgba(14,43,36,.06), 0 12px 32px -12px rgba(14,43,36,.12);
  --shadow-float: 0 18px 40px rgba(0,0,0,.28);          /* pills on pine */
  --shadow-logo: 0 14px 30px rgba(14,43,36,.25);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);     /* slight overshoot = "snap into place" */

  color-scheme: light;
}
```

Add matching `--color-*` entries in `@theme inline` (`pine`, `pine-2`, `pine-3`, `lime`, `lime-deep`, `sage`, `lilac`, `apricot`) so `bg-pine`, `text-lime`, etc. work. Update `::selection` to lime background with pine text, `:focus-visible` to a 2px **pine** outline (on pine surfaces, a lime outline). In `layout.tsx`, set `themeColor: "#F3F2EE"` and `colorScheme: "light"`. Keep the grain overlay but drop its opacity to `0.025`.

---

## 3. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display & headings | **Poppins** (`next/font/google`) | 500 | Tight tracking `-0.045em`, line-height `1.02` |
| Body | **Poppins** | 300 / 400 | Body copy 300 at ≥17px, UI text 400 |
| Emphasis in body | Poppins | 500 | In pine, inside muted paragraphs |
| Labels, data, eyebrows | **JetBrains Mono** (already loaded) | 400 | UPPERCASE, tracking `0.06–0.08em`, 11–13px, colour `--fg-3` (or lime/porcelain-60% on pine) |

- **Remove Instrument Serif and Instrument Sans.** The `.accent-serif` style and `{ serif: true }` segments in `TextReveal` are replaced by the **lime highlighter** treatment (3.2).
- Swap in `layout.tsx`: `Poppins({ subsets:["latin"], weight:["300","400","500","600"], variable:"--font-sans-face" })`. Point `--font-serif` to the sans so nothing breaks, or delete its usages.

### 3.1 Type scale (fluid)

| Style | Size | Weight / tracking |
|---|---|---|
| Hero H1 | `clamp(2.6rem, 5.6vw, 5.4rem)` | 500 / -0.045em / lh 1.02 |
| Section H2 | `clamp(2rem, 4vw, 3.6rem)` | 500 / -0.04em / lh 1.05 |
| H3 / card title | `clamp(1.25rem, 1.8vw, 1.75rem)` | 500 / -0.03em |
| Lead paragraph | `clamp(1.05rem, 1.3vw, 1.2rem)` | 300 / lh 1.6 / `--fg-2` |
| Body | 16–17px | 300–400 / lh 1.6 |
| Eyebrow / mono label | 12px | JetBrains Mono, uppercase, 0.08em |

### 3.2 Lime highlighter (signature text treatment)

Used on the key phrase of every H1/H2 (one phrase per heading, max).

```css
.hl { position: relative; white-space: nowrap; z-index: 0; }
.hl::after {
  content: ""; position: absolute; z-index: -1;
  left: -0.08em; right: -0.1em; bottom: 0.08em; height: 0.36em;
  background: var(--lime); border-radius: 0.1em; transform: rotate(-1deg);
  transform-origin: left center;
}
```

**Animation:** when the heading enters the viewport, the highlighter **draws left → right** (`scaleX 0 → 1`, 700ms, `--ease-out`, ~300ms after the text reveal). On pine backgrounds the highlighted words turn lime *text* instead (no bar).

For long phrases that wrap (like the hero), apply `.hl` per line or per word group so the bar follows each line, and allow wrapping (`white-space: normal` + `box-decoration-break: clone` via a background-gradient version if simpler).

---

## 4. Brand assets & core components

### 4.1 Logo

- **Mark:** a pine rounded square (radius 30% of its size) containing three small blocks: a tall **sage** bar on the left, a **lilac** square top-right, and a **lime** square bottom-right. Soft drop shadow `--shadow-logo`.
- **Wordmark:** lowercase **`nexor`** in Poppins 500, tracking `-0.05em`, pine, followed by a **lime full stop** `.`. Under it, `AUTOMATIONS` in mono, tracking `0.42em`, `--fg-3`.
- Replace `src/components/layout/logo.tsx` and `src/app/icon.svg` with this.

```svg
<svg viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg">
  <rect width="86" height="86" rx="26" fill="#0E2B24"/>
  <rect x="18" y="18" width="22" height="50" rx="9" fill="#A9C8B4"/>
  <rect x="46" y="18" width="22" height="22" rx="9" fill="#C7BEF0"/>
  <rect x="46" y="46" width="22" height="22" rx="9" fill="#C6F432"/>
</svg>
```

**Logo micro-interaction:** on hover the three inner blocks shift 2px apart and snap back (`--ease-snap`, 300ms). The page loader (`page-loader.tsx`) shows the same three blocks dropping into the square one by one, then the loader wipes away.

### 4.2 Buttons

- **Primary:** pill, `bg-pine`, porcelain text, Poppins 500, padding `18px 28px`, with a **26px lime circle containing a pine arrow →** on the right. Hover: background → Pine 2, arrow circle slides 4px right, subtle lift (`translateY(-1px)`). Keep the existing `Magnetic` wrapper.
- **Secondary:** pill, transparent, `1.5px solid pine` border, pine text. Hover: pine fill and porcelain text (fill wipes in from the left).
- **On pine panels:** primary becomes a lime pill with pine text; secondary becomes a porcelain-30% outline.
- Update `src/components/ui/button.tsx` variants: `primary`, `ghost` (secondary), `lime`, `onDark`.

### 4.3 Cards (light)

- White, radius `--radius-lg` (26–28px), `--shadow-card`, no visible borders (or `--line` at most).
- Inner padding 20–28px. Mono uppercase caption at the top (`--fg-3`), content below.
- Hover: lift 4px, shadow deepens, and if the card has a mini block icon it rotates slightly in 3D (see 6.2).

### 4.4 Pine panel (signature container)

The dark-green rounded panel from the approved board. Use it for the hero visual, featured case studies, the CTA band and the footer.

```css
.pine-panel {
  position: relative; overflow: hidden; border-radius: var(--radius-xl);
  background: radial-gradient(120% 90% at 55% 40%, #1B463B 0%, #0E2B24 60%, #0A211B 100%);
  color: #F3F2EE;
}
.pine-panel::before {           /* lime dot grid */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(rgba(198,244,50,.13) 1.2px, transparent 1.3px);
  background-size: 26px 26px;
}
```

Top-left of a hero/feature panel: a mono status label, e.g. `LIVE SYSTEM VIEW · ● 6 BLOCKS CONNECTED`, with the dot and count in lime.

### 4.5 Notification pills (floating over pine)

Porcelain pill (`rgba(243,242,238,.96)`), radius 999, padding `11px 18px 11px 12px`, `--shadow-float`, 14px text. On the left a **24px lime circle with a ✓**; on the right a mono timestamp/tag in `--fg-3` (e.g. `3s`, `auto`, `09:12`).

Example copy (rotate through these):
- ✓ New lead from Instagram → assigned to Ritesh · `3s`
- ✓ Salary slips generated for 42 staff · `auto`
- ✓ Low stock → supplier notified · `09:12`
- ✓ Invoice sent on WhatsApp · `09:41`
- ✓ Daily report ready · `08:00`

### 4.6 Chips / tags

Pill, 13px, padding `8px 14px`. Default `bg-bg` (porcelain) with pine text. Active: pine bg + porcelain text. Status: lime bg + pine text with a `●`. Used for service filters, tech stack and project tags.

### 4.7 Inputs (contact form)

White fill, radius 14px, 1px `--line-strong` border, 16px Poppins 400. Focus: border pine plus `0 0 0 4px rgba(198,244,50,.45)` lime ring. Errors: `--danger` text, 13px. Submit uses the primary button. The success state shows a lime ✓ block and the copy "Request received — we'll reply within 24 hours."

---

## 5. Hero — exact spec

### 5.1 Layout (desktop ≥1024px)

Two columns inside `--max-w` (1360px): **left ≈ 42% copy**, **right ≈ 58% pine panel** (aspect ≈ 1020×742, radius 44px). On mobile, the copy comes first and the panel goes below at full width (aspect 4:5), with the 3D scene reduced (see 5.4).

### 5.2 Copy

- **Logo lockup** at the top-left (nav handles it on the site; the hero needs no second logo).
- Eyebrow (mono): `CUSTOM SOFTWARE · ERP · CRM · WHATSAPP AUTOMATION`
- **H1 (approved, from Concept 01):**
  > We turn spreadsheets, chats & busywork into **systems that run themselves.**

  "systems that run themselves." gets the lime highlighter (3.2). Reveal the H1 word by word with the existing `TextReveal` (stagger 0.05s); the highlighter draws after.
- **Lead:** "Your CRM, orders, payroll and WhatsApp live in different places today. **We connect them into one custom system** — designed, built, automated and supported by our team."
- **CTAs:** Primary "Automate my business →" (scrolls to `#contact`). Secondary "How it works" (scrolls to `#process`).
- Optional availability chip above the H1 (it already exists in `hero-copy.tsx`): porcelain pill with a lime pulsing status dot.

### 5.3 The 3D block scene (the most important part)

Rebuild `src/components/three/hero-scene.tsx` (rename it `blocks-scene.tsx`) in **React Three Fiber**. The canvas sits *inside* the pine panel with a transparent background (`gl={{ alpha: true }}`), so the CSS gradient and dot grid show through. The notification pills and status label are HTML overlays on top of the canvas, not in the canvas.

**Camera & framing**
- `PerspectiveCamera` with `fov ≈ 22–28°`, positioned high and diagonal (≈ `[9, 11, 9]`), looking at the block cluster. Low FOV gives the near-isometric "product shot" look from the board.
- The cluster is tilted the way the board shows it: rows running diagonally from bottom-left to top-right.

**Geometry**
- Every block is a drei `<RoundedBox args={[w, h, d]} radius={0.18} smoothness={6}>`, with `h` as the extrusion height. These are soft keycap-like slabs, not cubes.
- Block footprint ≈ `1.9 × 1.9` units with gaps ≈ `0.3`. The core is ≈ `2.4 × 2.4`.

**Block map** (matches the approved board; x = right, z = toward camera, h = height)

| Block | Colour (top / sides) | Footprint | Height | Label on top face | Extra detail on top face |
|---|---|---|---|---|---|
| WhatsApp | Sage `#A9C8B4` / `#7FA28C` | 1.9×1.9 | 0.45 | `01 · CHAT` + **WhatsApp** | 3 rounded "message lines" |
| CRM | Lilac `#C7BEF0` / `#968BCB` | 1.9×1.9 | 0.70 | `02 · LEADS` + **CRM** | one rounded "card" shape |
| Orders | Apricot `#F4B98A` / `#CC8B5C` | 1.9×1.9 | 0.30 | `03 · SALES` + **Orders** | 3 lines |
| Payroll | White `#F6F5F1` / `#BDBBB2` | 1.9×1.9 | 0.55 | `04 · TEAM` + **Payroll** | 2 lines |
| **Nexor core** | **Lime `#C6F432` / `#8FB514`** | **2.4×2.4** | **1.20** | `NEXOR CORE` + **Automated ✓** | **4 small pine 3D bars** rising out of the top (mini chart) |
| Reports | White / `#BDBBB2` | 1.9×1.9 | 0.75 | `05 · INSIGHT` + **Reports** | 2 lines |
| Stock | Sage / `#7FA28C` | 1.5×1.5 | 0.36 | `06` + **Stock** | — |

Layout: a 2×2 cluster of WhatsApp/CRM/Orders/Payroll on the left, the core to their upper-right, Reports below the core, and Stock to the far right. Copy positions from the board image (`docs/design/concept-03-building-blocks.png`).

**Labels on blocks:** drei `<Text>` (troika) lying flat on each top face (rotation `-π/2` on X), Poppins Medium for titles (put the TTF in `/public/fonts/`), JetBrains Mono for small labels, pine colour at 75–100% opacity. The "lines" are thin `RoundedBox` slabs (height 0.01) in `rgba(14,43,36,.18)`.

**Materials (soft clay / keycap look)**
- `meshPhysicalMaterial` with `roughness 0.42`, `metalness 0`, `clearcoat 0.35`, `clearcoatRoughness 0.4`, and colour per block.
- For the visible "side colour" difference, either use a separate darker material on the sides (two-material RoundedBox via groups) or rely on lighting and add a subtle vertical gradient via `onBeforeCompile`. Matching the board's look matters more than the technique.
- Core block: `emissive "#C6F432"`, `emissiveIntensity 0.08` idle, pulsing to 0.25 (see animation).

**Lighting**
- `ambientLight` at 0.5.
- Key `directionalLight` from the top-left-front (≈ `[-6, 12, 6]`), intensity ~2.2, `castShadow`, shadow-map 2048, soft (`shadow-radius`, or use drei `<SoftShadows />`).
- A soft rim from behind-right in a cool pine-tint (`#9FE3C8`, low intensity) so the edges glow slightly against the dark panel.
- drei `<Environment>` with `<Lightformer>`s for the soft reflections on the clearcoat (no HDR download; build it from Lightformers like the current scene does).
- **Ground:** an invisible shadow-catcher plane (`shadowMaterial`, opacity 0.35) so blocks cast soft dark shadows onto the pine panel. Alternatively, use drei `<ContactShadows opacity={0.55} blur={2.6} far={4} />`.

**Connectors:** thin lime "wires" lying on the floor between the modules and the core (flat rounded tubes or `Line` from drei, width ~3px, `#C6F432`, with glow via additive blending). A few long, faint lime lines extend out of the cluster toward the panel edges (as on the board).

### 5.4 Hero animations (required)

All timings are a guide. Use GSAP timelines for sequenced intros and `useFrame` for continuous motion. Everything must be smooth at 60fps on a mid-range laptop.

**A. Intro "assembly" (on load, after the page loader)**
1. The blocks start **scattered**: random positions up to 3 units away and 2–4 units above, random rotations (±40°), scale 0.85, opacity 0.
2. They **fly in and snap into the grid** one by one, staggered 90ms, in this order: Orders → WhatsApp → Payroll → CRM → Reports → Stock. Each lands with a small **overshoot and settle** (GSAP `back.out(1.6)`, 900ms) and a tiny squash (y-scale 0.94 → 1) on landing.
3. The **lime core drops in last** from higher up, with a stronger bounce and a soft **lime light flash** (point light at its position, 0 → 3 → 0.6 intensity over 600ms).
4. The connector wires **draw** from each module to the core (dash-offset animation, 600ms, staggered).
5. The core's 4 mini bars **grow** from 0 to their heights one by one.
6. The HTML pills slide in (`y: 12 → 0`, opacity, stagger 150ms), and the status label counts up `0 → 6 BLOCKS CONNECTED`.

Total intro ≈ 2.4s. It must not block reading: the hero copy reveals in parallel.

**B. Idle loop (continuous)**
- Each block **floats** gently: `y += sin(t * 0.8 + phase) * 0.04`, with a tiny rotation wobble (±0.6°). Every block gets a different phase.
- **Data pulses:** every 1.6–3s (randomised), a small glowing lime sphere (radius 0.06, emissive) travels along a connector from a random module block to the core (700ms, ease-in-out). When it arrives:
  - the core does a quick "receive" bump (y +0.06 → 0, emissive 0.08 → 0.25 → 0.08),
  - one of the core's mini bars ticks up slightly,
  - the matching **notification pill swaps** to a new message (crossfade + slide, 400ms). Cycle through the list in 4.5 and keep 3 visible at once.
- The status dot in `LIVE SYSTEM VIEW` pulses (CSS).

**C. Pointer interaction**
- **Parallax tilt:** the whole block group rotates toward the cursor, max ±5° on Y and ±3° on X, damped (`lerp 0.06`/frame). Use the panel's bounding box, not the window.
- **Hover a block** (R3F raycast `onPointerOver`): it **lifts** 0.25 units with a spring, its shadow softens and spreads, the cursor becomes a pointer, and a small porcelain tooltip appears above it with the full service name (e.g. "WhatsApp Business Automation →"). The other blocks dim slightly (opacity 0.85).
- **Click / tap a block:** a **keycap press** (y-scale 0.92, 120ms, then release with overshoot), then smooth-scroll to that service in the Services section (`scrollToId("services")` plus select that service in `services-explorer.tsx`).

**D. Scroll**
- As the hero scrolls out (progress 0 → 1), the blocks **lift apart vertically** in a slight exploded view (each y += progress × (0.4–1.2), staggered) and the camera dollies back a little. The pills drift up faster than the panel (parallax). Use the existing `motion` `useScroll` or a GSAP ScrollTrigger tied to Lenis.

**E. Reduced motion / fallbacks**
- `prefers-reduced-motion`: render the **assembled final state** with no float, pulses, tilt or scroll explode. Pills stay static and hover lift remains (instant).
- **No WebGL / low-power / `saveData`:** show a static **pre-rendered PNG/AVIF** of the assembled scene (render one from the canvas, or use the board crop) inside the same pine panel with the same HTML pills.
- **Mobile (<768px):** show 5 blocks (drop Stock and Reports), disable shadows-on-hover dimming, set `dpr={[1, 1.5]}`, disable pointer tilt, and use device orientation only if it's cheap; otherwise keep it static and let the idle loop run.

### 5.5 Performance requirements

- Load the canvas with `next/dynamic(() => import(...), { ssr: false })`. Show the static poster until the first frame renders, then crossfade.
- Keep the current pattern of **pausing rendering when the panel is off-screen** (IntersectionObserver → `frameloop="never"`/`"demand"`).
- `dpr={[1, 2]}`, shadows only from the key light, one shadow map, and `<AdaptiveDpr pixelated={false} />` + `<PerformanceMonitor>` from drei to step quality down.
- Fonts for `<Text>` are preloaded. Total hero JS added ≤ ~250KB gz beyond what three/R3F already cost.
- Lighthouse on `/`: Performance ≥ 85 desktop and no layout shift from the canvas (reserve the panel's aspect ratio).

---

## 6. Reusing the 3D block language across the site

The blocks are the brand's visual language, not just a hero trick. Reuse them so the site feels like one system.

### 6.1 Shared building pieces
- Create `src/components/three/block.tsx` (one rounded block with colour, size, label, hover lift and press) and `src/components/three/block-canvas.tsx` (a lightweight canvas wrapper with the standard lights, camera and shadow catcher). Every section uses these.
- For tiny decorative blocks (icons, cards), prefer **CSS 3D** (stacked-layer extrusion with `transform-style: preserve-3d`) over spinning up extra WebGL contexts. **Never have more than 2 WebGL canvases mounted at once.**

### 6.2 Section-by-section (home page order from `src/app/(site)/page.tsx`)

| Section / file | Redesign |
|---|---|
| **Navbar** `navigation/navbar.tsx` | Porcelain with blur (`rgba(243,242,238,.8)` + `backdrop-blur`) after scrolling. Logo left, links centre (Poppins 400, 15px, pine; active link gets a small lime dot below), primary pill "Book a free audit" on the right. Mobile: a full-screen pine sheet with large links and the blocks motif. |
| **Hero** `hero/*` | Section 5. |
| **Capabilities marquee** `sections/capabilities-marquee.tsx` | Porcelain-2 band. Items are **chips** (4.6) in alternating clay tints with a tiny CSS-3D block icon before each. Pause on hover (keep). |
| **Services** `services/*` | Heading: "Ten ways we take work **off your hands.**" Left: the list of 10 services as rows (mono number `01–10`, Poppins 500 title, short line). Right: a **pine panel with a single large 3D block** for the selected service that **rotates and morphs** (colour + top-face label + top-face detail) when the selection changes. Use one `BlockCanvas`, animating colour/label rather than remounting. Replace `service-glyph.tsx` glyphs with mini CSS-3D blocks in each service's colour. |
| **Work / Case studies** `projects/*`, `work/page.tsx`, `work/[slug]` | Heading: "Real systems, **running today.**" Cards are white, radius 28. Each card's visual area is a **mini pine panel** with that project's blocks (e.g. SOFT7 = WhatsApp + CRM + Campaigns blocks; Doveknot WedStaff = Staff + Attendance + Payroll + Reports; Jeevanka = Store + Orders + Payments). Use CSS-3D blocks here with the existing `tilt-card.tsx` for pointer tilt. Case study detail pages open with a full-width pine panel hero of the project's blocks assembling (reuse the hero scene component with a different block map), followed by Problem → What we built → Result sections, with results shown as big numbers on white cards and lime highlights. |
| **Process** `sections/process-section.tsx` (`id="process"`) | "How we **build it.**" Four steps (Map → Design → Build → Automate & support). **Scroll-driven:** a pine panel where blocks **stack one per step** as you scroll (pinned section, GSAP ScrollTrigger + Lenis); step text on the left highlights in sync. |
| **Why us** `sections/why-section.tsx` | 3–4 white cards with a CSS-3D block icon each in a clay colour; key phrase in pine 500. One card can be a pine card with lime text for contrast. |
| **Testimonials** `testimonials/*` | White quote cards, a large pine quotation mark, client name in 500, company in mono. Avatar placeholders are clay-coloured rounded squares with initials. The carousel keeps its logic. |
| **Tech ecosystem** `sections/tech-ecosystem.tsx` | Tech logos sit on small **white keycap tiles** (CSS-3D, 6px extrusion in `#D9D7D0`). On hover the tile presses down. |
| **FAQ** `sections/faq-*.tsx` | Accordion rows on porcelain with `--line` dividers. The open row gets a white card background. Toggle icon: a small pine rounded square with + / − in lime. |
| **Contact** `contact/*` | Two columns: left a **pine panel** with the heading "Let's automate **your business.**" (lime words), direct email/WhatsApp/phone as porcelain pills, and a few small floating 3D blocks (CSS-3D, idle float). Right: a white form card (4.7). |
| **Footer** `layout/footer*.tsx` | Full pine-3 footer. The large lowercase **`nexor.`** wordmark spans the width at the bottom (porcelain at 8% opacity, with a lime dot). Link columns in porcelain-70%, mono headings. Keep the existing footer-reveal effect. |
| **Page header** `layout/page-header.tsx` (inner pages) | Porcelain, mono eyebrow, big H1 with one highlighted phrase, a short lead, and a small floating block cluster on the right (CSS-3D). |
| **Not found** | "This block **doesn't exist.**" with one lonely tilted 3D block and a primary button home. |
| **OG images** `opengraph-image.tsx` | Porcelain left with the logo and headline, pine panel right with a static block render. |

### 6.3 Motion rules (site-wide)

- **Easing:** entrances use `--ease-out` (`[0.16,1,0.3,1]`); anything that "lands" or "snaps" uses `--ease-snap` (`back.out(1.6)`).
- **Durations:** 400–700ms for UI and 700–1000ms for section reveals. Nothing longer than 1.2s except the hero intro.
- **Reveals:** text rises 18px and fades in (the existing `Reveal`/`TextReveal`), then the highlighter draws.
- Blocks **never spin wildly**. They float, lift, press and snap, like physical objects with weight.
- Keep Lenis smooth scroll. Disable the custom cursor (`cursor.tsx`) on touch devices; on desktop, restyle it as a small pine dot that grows into a lime ring over interactive elements.

---

## 7. Layout, spacing & grid

- Max width `1360px`, gutter `clamp(1rem, 4vw, 3rem)` (existing `--gutter`).
- Section padding `clamp(5rem, 11vw, 9rem)`.
- 12-column grid. Section headings sit in cols 1–7, with an optional mono "index" label (e.g. `03 / SERVICES`) aligned right.
- Generous white space. On light sections, alternate porcelain and porcelain-2 backgrounds. Use **one pine panel per screen height at most**, so the dark green stays special.
- Radii: cards 26–28px, pine panels 44px (32px on mobile), pills 999px, inputs 14px.

---

## 8. Voice & microcopy

- Clear, helpful, a little playful: "an expert friend who explains tech simply."
- Speak to owners of growing businesses: concrete outcomes ("salary slips in one click", "leads assigned in 3 seconds") over buzzwords. **Avoid** "AI-powered", "synergy", "cutting-edge", "revolutionary".
- Use the block metaphor lightly: "snap together", "connected", "runs itself". Don't overdo it.
- Names Ayush, Parth and Ritesh can appear in example notifications and on the About page.

---

## 9. Don'ts

- ✗ No dark-mode site background, neon glows, purple/indigo gradients or "AI orb" visuals.
- ✗ No robots, robotic arms, gears or factory imagery. Nexor builds **software**.
- ✗ Lime is never used as body text on light backgrounds, and never as a large background fill outside the core block and small pills.
- ✗ No serif fonts and no italic display text.
- ✗ No more than 2 WebGL canvases at once, and no canvas without a static fallback.
- ✗ Don't change content structure, routes, API or DB schema as part of the theme work.

---

## 10. Acceptance checklist

- [ ] All tokens replaced in `globals.css`. No leftover `#6d7cff`, `#a77bff`, `#7ee8fa`, or dark `--bg` values in public pages (`grep` for them).
- [ ] Poppins + JetBrains Mono loaded via `next/font`. Instrument fonts removed.
- [ ] New logo in navbar, footer, loader, `icon.svg` and OG images.
- [ ] Hero H1 reads exactly: "We turn spreadsheets, chats & busywork into systems that run themselves." with the lime highlighter on "systems that run themselves."
- [ ] Hero pine panel renders the **WebGL block scene** matching the board, with intro assembly, idle float, data pulses and swapping pills, hover lift and tooltip, click press and scroll-to-service, pointer tilt, and scroll explode.
- [ ] Reduced-motion, no-WebGL and mobile fallbacks work.
- [ ] Every home section and inner page restyled per section 6.2. Contact form still submits. Admin still works and looks intact.
- [ ] `npm run lint` and `npm run typecheck` pass. `npm run build` succeeds.
- [ ] Lighthouse desktop performance ≥ 85 on `/`, CLS < 0.05, accessible contrast (AA) for all text.

---

## 11. Reference images

Put the approved boards in the repo for reference:

- `docs/design/concept-03-building-blocks.png`: **the approved theme** (colours, type, logo, pine panel, block layout, pills, chips).
- `docs/design/concept-01-quiet-engine.png`: **headline copy only.** Ignore its colours and fonts.
