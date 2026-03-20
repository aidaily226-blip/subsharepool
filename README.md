# SubSharePool 🔗

> Share anything. Save everything.

A platform to split subscription costs, share trips, discover creators, and connect with your community.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js + Google OAuth |
| Database | Supabase (Postgres) |
| Realtime | Supabase Realtime (messages) |
| Storage | Cloudflare R2 |
| Hosting | Cloudflare Pages |
| Ads | Google AdSense |

---

## Setup Guide (Step by Step)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up Supabase
1. Go to https://supabase.com and create a free project
2. Go to **SQL Editor** and paste the contents of `supabase-schema.sql`
3. Run it — all tables will be created
4. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3 — Set up Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project
3. Go to **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Also add: `https://subsharepool.com/api/auth/callback/google`
7. Copy Client ID → `GOOGLE_CLIENT_ID`
8. Copy Client Secret → `GOOGLE_CLIENT_SECRET`

### Step 4 — Fill in .env.local
```env
NEXTAUTH_SECRET=run_this_to_generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 5 — Run locally
```bash
npm run dev
```
Open http://localhost:3000 ✅

### Step 6 — Deploy to Cloudflare Pages
1. Push your code to GitHub
2. Go to https://dash.cloudflare.com → Pages
3. Connect your GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
5. Add all your environment variables in Cloudflare Pages settings
6. Deploy! 🚀

### Step 7 — Add Google AdSense
1. Apply at https://adsense.google.com
2. Once approved, replace `ca-pub-XXXXXXXXXXXXXXXX` in `components/layout/AdBanner.tsx`
3. Add AdSense script to `app/layout.tsx`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossOrigin="anonymous"></script>
```

### Step 8 — Make yourself admin
After signing in with Google, run this in Supabase SQL editor:
```sql
update users set role = 'admin' where email = 'your@email.com';
```

---

## Project Structure

```
subsharepool/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login page
│   ├── (main)/            # Blog, messages
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/            # Navbar, Footer, AdBanner
│   ├── shared/            # Hero, FilterBar, HomeTabs
│   ├── subscriptions/     # SubCard, SubscriptionsSection
│   ├── trips/             # TripCard, TripsSection
│   ├── links/             # LinkCard, LinksSection
│   ├── feed/              # FeedPostCard, FeedSection
│   └── blog/              # BlogEditorClient
├── lib/                   # Utils, types, Supabase, auth
├── middleware.ts           # Route protection
└── supabase-schema.sql    # Database schema
```

---

## Build Order (What's next)

- [x] Step 1 — Project setup & folder structure
- [x] Step 2 — Supabase schema
- [x] Step 3 — Google Auth (NextAuth)
- [x] Step 4 — Homepage + Navbar + Footer
- [x] Step 5 — All 4 sections (mock data)
- [x] Step 6 — Blog + Admin panel skeleton
- [ ] Step 7 — Connect Supabase (real data)
- [ ] Step 8 — Real-time messages
- [ ] Step 9 — Post listing forms
- [ ] Step 10 — AdSense + Cloudflare deploy

---

Built with ❤️ for the sharing community.
