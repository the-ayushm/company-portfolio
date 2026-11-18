# Deploying to production (Supabase + Render)

Stack: **Supabase** (free Postgres) · **Render** (Node web service) · photos in `public/images/` · videos embedded (YouTube/Vimeo).

Est. time: ~30 minutes. Cost: Supabase free, Render ~$7/mo (Starter, always-on) or free (cold starts).

---

## 1. Create the database (Supabase)

1. https://supabase.com → **New project**. Region **Singapore** (to sit next to Render). Set a strong **database password** and save it.
2. Top bar **Connect** → **Session pooler** (NOT Transaction). Copy the string — it looks like:
   `postgresql://postgres.abcxyz:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
3. Replace `[PASSWORD]`, then append `?sslmode=require`. Keep this as your **production `DATABASE_URL`**.

> Use the **Session pooler (port 5432)** for both the app and migrations. The Transaction pooler (6543) breaks Prisma migrations.

## 2. Generate production secrets

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"   # AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"   # IP_HASH_SALT
```

## 3. Create the schema + seed content (run once, from your machine)

Point the project at Supabase and run the migration + seed locally. In `.env`, temporarily set:

```ini
DATABASE_URL="postgresql://postgres.abcxyz:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
ADMIN_EMAIL="you@yourdomain.com"
ADMIN_PASSWORD="a-strong-password-min-12-chars"
ADMIN_NAME="Ayush"
```

Then:

```bash
npm run db:deploy   # creates all tables in Supabase
npm run db:seed     # seeds services/projects/FAQ etc. + creates your admin user
```

Verify in Supabase → **Table editor** (you should see the tables and rows). Now put your **local** `DATABASE_URL` back (the Docker one on port 5442) so local dev keeps working.

## 4. Push the code to GitHub

```bash
git init
git add -A
git commit -m "Agency website"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`.env` is git-ignored, so no secrets are pushed.

## 5. Deploy on Render

1. https://render.com → **New → Blueprint** → pick your repo. It reads `render.yaml`.
   (Or **New → Web Service** manually: build `npm install --include=dev && npm run build`, start `npm start`, region Singapore.)
2. In the service's **Environment** tab, set:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | your Supabase session-pooler string (step 1) |
   | `AUTH_SECRET` | from step 2 |
   | `IP_HASH_SALT` | from step 2 |
   | `NEXT_PUBLIC_BRAND_NAME` | your final agency name |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | public email |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-service>.onrender.com` (update later if you add a domain) |
   | `NEXT_PUBLIC_SHOW_PLACEHOLDERS` | `false` |

3. Deploy. First build takes a few minutes. Visit the URL → log in at `/admin`.

> `NEXT_PUBLIC_*` values are baked in at build time — after changing `NEXT_PUBLIC_SITE_URL` (e.g. adding a custom domain), trigger a redeploy.

## 6. Custom domain (optional)

Render → service → **Settings → Custom Domains** → add `yourdomain.com`, then create the CNAME/A record it shows at your registrar. Update `NEXT_PUBLIC_SITE_URL` to the domain and redeploy.

---

## Media

- **Photos**: drop files in `public/images/`, commit, push. Reference them in `/admin` by setting a project's cover image / gallery URL to `/images/yourfile.jpg`. 15 photos is nothing.
- **Videos**: don't commit large video files. Embed from YouTube/Vimeo, or use object storage (Cloudflare R2 / Bunny). Tell me where your videos are and I'll wire them in.
- **Admin image upload** (optional): works only with a Render **Disk** (uncomment the `disk:` block in `render.yaml`, Starter plan) — otherwise uploaded files vanish on redeploy. The `public/images/` route above needs no disk. (Since you're on Supabase, I can also switch uploads to free Supabase Storage — ask if you want that.)

## Day-to-day

- **Edit content / view leads**: the live `/admin`, which writes straight to Supabase.
- **Schema changes later**: edit `prisma/schema.prisma`, run `npm run db:migrate -- --name <change>` locally against Supabase, commit, push (Render redeploys).
- **Add another admin**: `npm run admin:create -- --email … --password …` (with `DATABASE_URL` pointed at Supabase).
