# BwAI Showcase

Showcase website karya peserta Build with AI Workshop. Login Google, submit satu karya per peserta, tampil di halaman utama dengan thumbnail preview.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- shadcn/ui (base-ui)
- Supabase (Auth + Postgres + RLS)

## Setup

### 1. Install dependensi

```bash
npm install
```

### 2. Buat Supabase project

1. Buka [supabase.com](https://supabase.com) → **New project**.
2. Setelah project siap, buka **SQL Editor** → jalankan isi `supabase/schema.sql`.
3. Buka **Settings → Data API** → salin `Project URL` dan `anon public key`.

### 3. Konfigurasi Google OAuth

1. Di Supabase dashboard: **Authentication → Providers → Google** → enable.
2. Ikuti link ke Google Cloud Console, buat OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000` (dan domain produksi Anda)
   - Authorized redirect URIs: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
3. Salin **Client ID** dan **Client Secret** ke Supabase Google provider → Save.
4. Di Supabase **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Additional redirect URLs: `http://localhost:3000/auth/callback` (dan URL produksi: `https://YOUR_DOMAIN/auth/callback`)

### 4. Environment variables

Copy `.env.local.example` → `.env.local`, isi dengan nilai dari langkah 2:

```bash
cp .env.local.example .env.local
```

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Struktur

```
src/
├── app/
│   ├── page.tsx              # Homepage (list karya)
│   ├── login/                # Google sign-in
│   ├── auth/callback/        # OAuth callback
│   └── dashboard/            # CRUD karya (auth-only)
├── components/
│   ├── navbar.tsx
│   ├── karya-card.tsx
│   ├── user-menu.tsx
│   └── ui/                   # shadcn components
├── lib/
│   ├── supabase/             # Browser + server clients
│   └── types.ts              # Karya type + thumbnail helper
└── proxy.ts                  # Session refresh (Next 16 = proxy, dulu middleware)

supabase/
└── schema.sql                # Tabel + RLS policies
```

## Thumbnail

Pakai `s.wordpress.com/mshots` (gratis, tanpa API key). Pertama kali URL di-request, mshots antri generate — muncul placeholder. Request ulang setelah beberapa detik menghasilkan screenshot final.

## Catatan Next.js 16

- File `middleware.ts` direname jadi `proxy.ts`, function `proxy()`.
- `cookies()` dan `params` kini async (pakai `await`).

## Aturan bisnis

- Satu user = satu karya (unique `user_id` di DB).
- RLS: semua boleh read, hanya owner yang bisa insert/update/delete miliknya.
