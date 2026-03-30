# SubSharePool v2 🔗

> Share anything. Save everything.

## Stack
- **Next.js 15** + TypeScript
- **React 19**
- **Tailwind CSS**
- **NextAuth v5** (Google login)
- **Supabase** (database + realtime)
- **OpenNext** (Cloudflare Pages adapter)

## Setup

### 1. Install
```bash
npm install
```

### 2. Environment Variables
Copy `.env.local` and fill in your values:
```
AUTH_SECRET=          # openssl rand -base64 32
AUTH_GOOGLE_ID=       # Google Cloud Console
AUTH_GOOGLE_SECRET=   # Google Cloud Console
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. Supabase
Run `supabase-schema.sql` in your Supabase SQL editor

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Cloudflare Pages

**Build settings in Cloudflare Dashboard:**
```
Build command:     npm run build && npx @opennextjs/cloudflare@latest
Build output dir:  .open-next/assets
Node version:      20  (Environment variable: NODE_VERSION=20)
```

**Environment variables to add in Cloudflare:**
```
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://subsharepool.com
```

### 6. Make yourself admin
After first login, run in Supabase SQL editor:
```sql
update users set role = 'admin' where email = 'your@email.com';
```

## Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://subsharepool.com/api/auth/callback/google`
