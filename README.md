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

Phase 1 (scaffold, design tokens, Supabase wiring, Home screen) is done and
wired to live data. All other visitor-app screens are routed and render as
placeholders until their build phase — see the project plan for the phase
breakdown.
