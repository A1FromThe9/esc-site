# esc-site — German companion marketplace (portfolio demo)

A **for-fun, full-stack portfolio build** of a compliant escort/companion
marketplace for Germany, where escort advertising is legal and regulated under
the **Prostituiertenschutzgesetz (ProstSchG)**.

> ⚠️ **This is a fictional demo.** No real people, no real transactions, no real
> identity verification. Payments and document verification are **mocked**. It is
> built _as if_ it were a production marketplace to demonstrate the architecture
> and compliance UX — not to be deployed or operated.

## Stack

- **Next.js 15** (App Router, TypeScript) + **React 19**
- **PostgreSQL** + **Drizzle ORM** (schema-as-TypeScript, SQL migrations)
- **Auth.js (NextAuth v5)** — credentials, JWT sessions, role-based access
- **Tailwind CSS v4** + custom components, **Phosphor** icons, **Geist** font
- Mock payment provider behind a Stripe-shaped interface (swappable later)

## Features (Phase 1–3 implemented)

- **Public browse** — home, city-filtered search, provider detail pages
- **Three roles** — client / provider / admin, enforced in middleware _and_
  server-side (defense in depth)
- **Provider onboarding** — register (21+ hard-validated) → submit mock ID +
  ProstSchG + health-counseling documents → admin review → verified
- **Admin panel** — verification queue with approve/reject, audit logging,
  trust-&-safety overview
- **Compliance first-class** — persistent demo banner, 18+/21+ gates, publish
  blocked until an approved ProstSchG certificate is on file, `/safety` and
  ProstSchG info pages

See [the build roadmap](#roadmap) for messaging, booking, and mock payments.

## Getting started

Requires Node 22+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env          # set DATABASE_URL + AUTH_SECRET
npm run db:push               # create tables
npm run db:seed               # cities, admin, demo client + 3 live providers
npm run dev                   # http://localhost:3000
```

`AUTH_SECRET` can be generated with `openssl rand -base64 32`. Hosting is free on
Neon or Supabase (Postgres) + Vercel (app).

### Demo logins

| Role     | Email                  | Password       |
| -------- | ---------------------- | -------------- |
| Admin    | `admin@esc-site.demo`  | `admin1234`    |
| Client   | `client@esc-site.demo` | `client1234`   |
| Provider | `lena@esc-site.demo`   | `provider1234` |

## Project layout

```
app/
  (public)/        home, /search, /provider/[slug], /safety, /legal/*
  (auth)/          /login, /register, /register/provider
  (client)/        /dashboard/*
  (provider)/      /provider-dashboard/*  (profile, verification)
  (admin)/         /admin/*               (verification queue, ...)
  actions/         server actions (auth, profile, verification, admin)
  api/auth/        Auth.js route handlers
lib/
  db/schema/       Drizzle tables (users, providers, bookings, moderation, ...)
  db/seed.ts       seed script
  auth/            Auth.js config, edge-safe middleware config, permissions
  data/            query helpers
  validation/      Zod schemas
middleware.ts      role-based route protection
```

## Roadmap

Each phase is independently demoable.

1. ✅ Foundations — auth, roles, schema, seed, provider profile CRUD
2. ✅ Public browse/search — city pages, provider detail
3. ✅ Verification & moderation — mock document upload, admin approval, publish gating
4. ⬜ Messaging & booking — conversations, booking request/accept
5. ⬜ Mock payments — checkout, booking↔payment linkage, refunds
6. ⬜ Trust & safety polish — reporting + auto-suspend, content scanning, audit-log UI

Payments are **mock only** (a Stripe-shaped `lib/payments/mock-provider.ts`
interface) — no real money ever moves.
