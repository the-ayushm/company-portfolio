# Agency Website — Digital Solutions & Software Engineering

Premium marketing site + admin panel for a three-person software development team
(Ayush, Parth, Ritesh). Built with **Next.js 16 (App Router, Cache Components)**,
**TypeScript**, **Tailwind CSS v4**, **PostgreSQL + Prisma 7**, **Motion**, **GSAP**,
**Lenis** and **React Three Fiber**.

> The brand name **“Studio Three” is a placeholder** — set `NEXT_PUBLIC_BRAND_NAME`.

---

## Quick start

```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # then fill AUTH_SECRET, ADMIN_PASSWORD, IP_HASH_SALT
npm run db:up               # PostgreSQL 17 in Docker on localhost:5442
npm run db:migrate          # apply migrations
npm run db:seed             # seed content from src/config/* + create the first admin
npm run dev                 # http://localhost:3000   (admin: /admin)
```

Production: `npm run build && npm start` (run `npm run db:deploy` against the production DB first).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | ≥ 32 random chars, signs admin session cookies |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | seed | First admin (password ≥ 12 chars) |
| `IP_HASH_SALT` | recommended | Salt for hashing visitor IPs (raw IPs are never stored) |
| `NEXT_PUBLIC_SITE_URL` | ✅ prod | Canonical URL for metadata, sitemap, OG |
| `NEXT_PUBLIC_BRAND_NAME` | | Agency name (placeholder until finalised) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | | Fallback public email (admin setting wins) |
| `NEXT_PUBLIC_SHOW_PLACEHOLDERS` | | `true` shows “To be confirmed” markers + sample testimonials. **Set `false` at launch.** |
| `UPLOAD_DIR` | | Disk folder for admin uploads (default `storage/uploads`) |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` `SMTP_FROM` `NOTIFY_EMAIL_TO` | optional | Email notification for new inquiries |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_GA_ID` | optional | Analytics, loaded only when set |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

## Content & honesty rules

All content lives in PostgreSQL and is editable at **/admin**. `src/config/*` holds the seed
data and is also the **fallback** if the database is unreachable, so the public site never goes down.

Nothing is invented: roles, bios, tech stacks, contributions, results and screenshots are left
empty until the team supplies them. While `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`, empty fields show a
visible **“To be confirmed”** marker. Projects without screenshots show an original, clearly labelled
**“Illustrative interface”** sketch (never stock imagery); uploading a cover screenshot replaces it.

**Testimonials** are public only when **Client approved** *and* **Published** are ticked. Seeded rows
are flagged *Sample* and always carry a “Sample — not a real review” label.

The admin **Dashboard** has a launch checklist that tracks what's still missing.

## Admin

- `/admin`: dashboard, inquiry stats and launch checklist
- **Inquiries**: search, filter by status, pagination, status workflow
  (New → Contacted → In discussion → Converted / Rejected), internal notes, WhatsApp/email shortcuts, delete
- **Projects** (incl. cover + gallery uploads, related services), **Services**, **Team**,
  **Testimonials**, **FAQ**, **Social links**, **Settings** (availability badge, contact email)

Create another admin or reset a password (also signs that admin out everywhere):

```bash
npm run admin:create -- --email you@company.com --password "a-long-password" --name "Ayush"
```

Security: bcrypt (cost 12) password hashes · HMAC-signed httpOnly `SameSite=Lax` session cookie (12 h) ·
proxy gate on `/admin` + `/api/admin`, plus a DB re-check (token version) in every handler ·
Origin check on mutating requests · login rate limit · upload magic-byte validation, 5 MB cap, random filenames.

## REST API

All responses are JSON. Errors use `{ "error": { "code", "message", "fields?" } }`.

### Public

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/contact` | Submit an inquiry → `201 { ok, id }` · `422` validation · `429` rate limited · `403` cross-origin |
| `GET` | `/api/projects` | Published projects |
| `GET` | `/api/projects/:slug` | One project · `404` |
| `GET` | `/api/services` | Published services |
| `GET` | `/api/testimonials` | Approved testimonials (samples flagged `isPlaceholder`) |
| `GET` | `/api/team` · `/api/faqs` | Team members · FAQs |

`POST /api/contact` body:

```json
{
  "fullName": "Priya Sharma", "email": "priya@example.com", "phone": "+91 90000 00000",
  "companyName": "Example Retail", "projectType": "WhatsApp Automation",
  "estimatedBudget": "3l-7l", "projectTimeline": "1-3m",
  "description": "At least 30 characters…", "consent": true,
  "website": "", "startedAt": 1763450000000
}
```

Spam protection: honeypot `website` field, minimum 3 s fill time (`startedAt`), 5 requests / 10 min per IP.
Spam is answered with `201` but not stored. Option values live in `src/config/contact.ts`.

### Admin (session cookie required)

| Method | Path |
| --- | --- |
| `POST` | `/api/admin/auth/login` · `/api/admin/auth/logout` |
| `GET` | `/api/admin/auth/me` |
| `GET` `POST` | `/api/admin/{projects,services,team,testimonials,faqs,social-links}` |
| `GET` `PUT` `DELETE` | `/api/admin/{resource}/:id` |
| `GET` | `/api/admin/inquiries?q=&status=&page=&pageSize=` |
| `GET` `PATCH` `DELETE` | `/api/admin/inquiries/:id` (PATCH `{ status?, adminNotes? }`) |
| `GET` `PUT` | `/api/admin/settings` |
| `POST` | `/api/admin/uploads` (multipart `file`) → `{ url }` |

Writes invalidate the public cache immediately (`revalidateTag("content", { expire: 0 })`).

## Database

Schema: `prisma/schema.prisma`. Models: `AdminUser`, `TeamMember`, `Service`, `Project`, `ProjectImage`,
`Testimonial`, `Faq`, `SocialLink`, `SiteSettings`, `ContactInquiry` (+ `InquiryStatus` enum).

```bash
npm run db:migrate -- --name <change>   # create & apply a migration (dev)
npm run db:deploy                       # apply migrations (prod/CI)
npm run db:studio                       # browse data
```

## Project structure

```
src/
  app/(site)/        public pages: /, /work, /work/[slug], /services, /about, /contact, /privacy
  app/admin/         login + protected panel (route group (panel))
  app/api/           REST route handlers (public + admin)
  app/uploads/       serves uploaded images
  components/        hero, three, team, services, projects, sections, testimonials, contact, admin, animations, ui
  config/            site, navigation, content seeds, contact options (INR budgets)
  lib/               db, auth, api helpers, data access (cached), validations (Zod), seo, email, uploads, security
  proxy.ts           admin gate (Next 16 "proxy", formerly middleware)
prisma/              schema, migrations, seed
scripts/             create-admin
```

## Performance & accessibility

- The 3D hero is dynamically imported after idle, paused off-screen, and lighter on mobile. It's skipped
  for `prefers-reduced-motion` and when WebGL is unavailable, falling back to a static SVG.
- Lenis smooth scroll only runs on fine pointers without reduced motion. GSAP/Motion respect reduced motion.
- Public pages are prerendered (Cache Components) and revalidated on admin edits. Images go through `next/image` (AVIF/WebP).
- Semantic landmarks, skip link, labelled controls, focus styles. Content stays visible without JavaScript.

## Deployment notes

- Uploads and the rate limiter are designed for a single Node server (VPS/Docker). For serverless or multiple
  instances, move uploads to object storage (`src/lib/uploads/storage.ts`) and rate limiting to Redis
  (`src/lib/security/rate-limit.ts`). Both are isolated behind small interfaces.
- Review `/privacy` with a legal advisor (e.g. against India's DPDP Act 2023) before launch.
