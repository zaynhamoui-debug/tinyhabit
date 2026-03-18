# TinyHabit

A full-stack habit tracker built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Auth** — email/password sign up, log in, log out, protected routes
- **Habit dashboard** — view all habits, mark complete/incomplete for today
- **Habit management** — create, edit, delete habits (with name, emoji, color)
- **Stats** — current streak, longest streak, total completions per habit
- **Row-Level Security** — users can only access their own data

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 2. Clone and install

```bash
git clone <repo-url>
cd tinyhabit
npm install
```

### 3. Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Wait for it to provision (~1 min)

### 4. Run the database schema

1. In Supabase dashboard → **SQL Editor** → New query
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

### 5. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role key *(seed only)* |

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Seed demo data (optional)

The seed script creates a demo user and 5 habits with 30 days of history.

```bash
npm run seed
```

**Demo credentials:**
- Email: `demo@tinyhabit.app`
- Password: `demo123456`

> Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

Alternatively, run `supabase/seed.sql` manually in the SQL Editor after replacing `YOUR_USER_UUID` with a real user ID from Authentication → Users.

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

> Do **not** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel — it's only for local seeding.

---

## Project structure

```
src/
├── actions/        # Server actions (auth, habits)
├── app/
│   ├── (auth)/     # Login & signup pages
│   ├── api/        # Auth callback route
│   └── dashboard/  # Protected dashboard
├── components/     # UI components
├── lib/
│   ├── supabase/   # Browser & server Supabase clients
│   ├── types.ts    # Shared TypeScript types
│   └── utils.ts    # Streak calculation helpers
└── middleware.ts   # Auth redirect middleware
supabase/
├── schema.sql      # Tables + RLS policies
└── seed.sql        # Manual seed (SQL)
scripts/
└── seed.ts         # Programmatic seed script
```

## Database schema

```
habits
  id, user_id, name, emoji, color, created_at, updated_at

habit_logs
  id, habit_id, user_id, completed_date, created_at
  UNIQUE (habit_id, completed_date)
```

All tables have Row Level Security enabled — users can only read and write their own rows.
