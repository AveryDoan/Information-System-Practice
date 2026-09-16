# NT Tourism App — Prototype

A responsive web-app prototype of the NT Tourism App Figma design (Tourist/Visitor
portal), built with React + Vite + TypeScript + Tailwind CSS and backed by Supabase.

Design source: [Figma — NT Tourism App Prototype](https://www.figma.com/design/VXDw7nXxK4C0LUtIFL8K6r/NT-Tourism-App--Prototype)

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (design tokens in `src/index.css`, pulled from the Figma file)
- React Router v6
- Supabase (Postgres + Auth) via `@supabase/supabase-js`
- TanStack Query for data fetching
- Zustand (planned, for the trip-wizard draft state)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + publishable key
npm run dev
```

## Troubleshooting

`npm install` hanging indefinitely on this network (and the Supabase CLI's
direct `db push` failing with `ECONNREFUSED` on an IPv6 address) both trace to
the same cause: IPv6 routes are broken/blackholed here, and IPv6 is tried
first. Fix for npm: `NODE_OPTIONS="--dns-result-order=ipv4first" npm install`.

## Database

Schema and RLS policies live in `supabase/migrations/0001_init.sql`; sample data in
`supabase/seed.sql`. Run both in your Supabase project's **SQL Editor** (in order).

The schema follows the project's data dictionary/ERD: `users`, `user_preferences`,
`trips`, `trip_items`, `saved_items`, `tourism_content`, `recommendations`,
`external_data`, `notifications`. Two deliberate additions beyond the dictionary
are documented inline in the migration file (`users.auth_user_id` linking to
Supabase Auth, and `tourism_content.image_url` / `event_datetime` for the UI).

Once the Supabase CLI is linked to the project, regenerate types with:

```bash
supabase gen types typescript --linked > src/lib/database.types.ts
```

## Project structure

```
src/
  routes/       one file per Figma screen
  components/   shared UI (AppShell, BottomNav, Placeholder)
  lib/          supabase client, AI mock layer, DB types
  hooks/        react-query hooks
supabase/
  migrations/   SQL schema
  seed.sql      sample published content
```

## Build status

Done and wired to live Supabase data:
- Phase 1 — scaffold, design tokens, Home screen
- Phase 2 — Auth (Login/Sign Up/Profile via Supabase Auth)
- Phase 3 — Destination Detail, Event Discovery, Where to Stay/Eat/Do, save/unsave
- Phase 4 — Plan Trip wizard, Trip Dashboard, My Trips, Recommended Itinerary
  (auto-itinerary is a deterministic category match today, not a real AI call)
- Phase 5 — Discover (button-driven swipe over `saved_items`), AI Chatbot
  (fully mocked — see `src/lib/ai.ts`, clearly labeled in the UI as a mock reply)

- Staff Portal (`/staff/login`) — a separate desktop dashboard (not the phone
  frame), gated to `NTG Staff` / `Administrator` roles: content moderation
  (Manage Tourism Content, Manage Providers & Partnerships share one editor),
  Visitor Engagement Analytics, and Recommendation Analytics & Trends — all
  real aggregate queries, no mock numbers. Promote an account to staff with
  `update users set role = 'NTG Staff' where email = '...'` in the SQL Editor.

Swap `src/lib/ai.ts` for a real model call (e.g. via a Supabase Edge
Function, so no key sits in client code) whenever that's ready.

Still not built: System Administrator portal (users/roles, system config,
integrations, health monitor, audit log — see the Figma file's third
section), and the Smart Itinerary Planner is a keyword matcher, not a real
model.
