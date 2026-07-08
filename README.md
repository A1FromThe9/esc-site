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
- Mock payment provider behind a Stripe-shaped interface (swappable for real
  Stripe test mode later without touching call sites)

## Features (all 6 phases implemented)

- **Public browse** — home, city-filtered search, provider detail pages
- **Three roles** — client / provider / admin, enforced in middleware _and_
  server-side (defense in depth)
- **Provider onboarding** — register (21+ hard-validated) → submit mock ID +
  ProstSchG + health-counseling documents → admin review → verified →
  self-service **publish** once a server-side checklist passes (verified +
  approved ProstSchG cert + complete profile)
- **Messaging** — client ↔ provider conversations with polling-based live
  updates (no persistent socket on this deployment target)
- **Booking** — request → provider accepts (sets agreed rate) / declines →
  mock checkout → paid → completed, with cancel-and-refund at any pre-completion
  stage
- **Mock payments** — Stripe-shaped `lib/payments/mock-provider.ts`; a checkout
  page with a fake card form; no real transaction ever occurs
- **Reporting & auto-suspend** — report a profile or a client from a profile
  page or a conversation thread; `suspected_coercion` / `suspected_minor`
  reports immediately pull the profile from search pending admin review
- **Content policy scan** — keyword/pattern scan on profile bio/tagline edits;
  flagged edits are held in the moderation queue instead of publishing
- **Admin panel** — verification queue, moderation queue, reports queue, user
  suspend/reinstate, and a full audit log of every trust-&-safety decision
- **Compliance first-class** — persistent demo banner, 18+/21+ gates, `/safety`
  and ProstSchG info pages

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
| -------- | ----------------------- | -------------- |
| Admin    | `admin@esc-site.demo`  | `admin1234`    |
| Client   | `client@esc-site.demo` | `client1234`   |
| Provider | `lena@esc-site.demo`   | `provider1234` |

### Try the full loop

1. Log in as the client, browse `/search`, open a provider, click **Message**
   and **Request booking**.
2. Log in as the provider (e.g. `lena@esc-site.demo`), accept the booking with
   an agreed rate from `/provider-dashboard/bookings`.
3. Back as the client, pay via `/dashboard/checkout/[bookingId]` (any mock card
   number works) and mark the booking completed.
4. Log in as `admin@esc-site.demo` to review `/admin/verification`,
   `/admin/reports`, `/admin/moderation-queue`, and `/admin/audit-log`.

## Project layout

```
app/
  (public)/        home, /search, /provider/[slug], /safety, /legal/*
  (auth)/          /login, /register, /register/provider
  (client)/        /dashboard/*            (messages, bookings, checkout, reports)
  (provider)/      /provider-dashboard/*   (profile, verification, messages, bookings)
  (admin)/         /admin/*                (verification, moderation, reports, users, audit log)
  actions/         server actions (auth, profile, verification, admin, messaging,
                    bookings, payments, reports, moderation)
  api/auth/        Auth.js route handlers
  api/conversations/[id]/messages   polling endpoint for the message thread UI
lib/
  db/schema/       Drizzle tables (users, providers, bookings, messaging, moderation, ...)
  db/seed.ts       seed script
  auth/            Auth.js config, edge-safe middleware config, permissions
  data/            query helpers
  validation/      Zod schemas
  moderation/      content policy keyword scan
  payments/        mock payment provider (Stripe-shaped interface)
middleware.ts      role-based route protection
```

## Roadmap (complete)

Each phase was independently demoable during development.

1. ✅ Foundations — auth, roles, schema, seed, provider profile CRUD
2. ✅ Public browse/search — city pages, provider detail
3. ✅ Verification & moderation — mock document upload, admin approval, publish gating
4. ✅ Messaging & booking — conversations, booking request/accept/decline
5. ✅ Mock payments — checkout, booking↔payment linkage, refunds
6. ✅ Trust & safety polish — reporting + auto-suspend, content scanning,
   moderation queue, audit-log UI, user suspension

Payments are **mock only** — no real money ever moves, no real payment
processor is integrated.
