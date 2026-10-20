# Offer Sprint

A personal tracker for an 8-week interview sprint (Oct 20 → Dec 20, 2026): daily plan and log, DSA and application targets, an applications pipeline, and a scope checklist.

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Drizzle ORM · Neon Postgres · deployed on Vercel.

## Features

- **Today:** the day's planned tasks (weekday or weekend routine for the current week), a log form, and progress stats
- **Daily log:** all 62 days, each with its plan, DSA solved, apps sent, status and notes
- **Applications:** add and update companies with source, referral, status and next round
- **Plan:** scope checklist, weekday/weekend routine, 8-week plan and rules
- **Login:** single password, signed httpOnly cookie
- Tables are created automatically on the first request, so there are no migrations to run

## Deploy on Vercel (about 10 minutes)

1. **Import the repo:** in Vercel, go to *Add New → Project*, pick this GitHub repo, and keep the defaults (framework: Next.js).
2. **Add the database:** in the project, open *Storage → Create Database → Neon (Postgres)*, then connect it to the project. This sets `DATABASE_URL` for you.
3. **Add env vars** under *Settings → Environment Variables*:
   - `APP_PASSWORD`: the password you'll log in with
   - `AUTH_SECRET`: a long random string (for example, the output of `openssl rand -hex 32`)
4. **Redeploy** (*Deployments → ⋯ → Redeploy*) so the new env vars are picked up.
5. Open the URL and log in.

## Run locally

```bash
cp .env.example .env.local   # fill in DATABASE_URL from Neon, APP_PASSWORD, AUTH_SECRET
npm install
npm run dev
```

## Project layout

```
app/
  login/              password screen
  (app)/              authenticated pages: Today, Daily log, Applications, Plan
lib/
  plan.ts             the 8-week plan, routines, scope and targets
  schema.ts           Drizzle tables: day_logs, applications, scope_items
  db.ts               Neon client + table bootstrap
  actions.ts          server actions (all check auth)
  queries.ts          reads + stats
  auth.ts             cookie session
```

To change targets or the plan, edit `lib/plan.ts` and push.
