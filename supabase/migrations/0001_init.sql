-- NT Tourism App — initial schema
-- Mirrors the data dictionary / ERD: USER, USER_PREFERENCE, TRIP, TRIP_ITEM,
-- SAVED_ITEM, TOURISM_CONTENT, RECOMMENDATION, EXTERNAL_DATA, NOTIFICATION.
--
-- Two deliberate departures from the dictionary, both noted inline:
--   1. `users.password_hash` is kept as a column (matches the dictionary) but is
--      never written to by the app — Supabase Auth (`auth.users`) owns real
--      credential storage/hashing. `users.auth_user_id` links the two.
--   2. `tourism_content.image_url` and `tourism_content.event_datetime` are
--      added beyond the dictionary's attribute list — the UI needs a photo and
--      a sortable event date/time that don't fit cleanly into `location`.

-- ---------------------------------------------------------------------------
-- USER
-- ---------------------------------------------------------------------------
create table public.users (
  user_id bigint generated always as identity primary key,
  auth_user_id uuid unique references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  password_hash text, -- unused: Supabase Auth manages real credentials
  role text not null default 'Visitor'
    check (role in ('Visitor', 'NTG Staff', 'Administrator')),
  account_status text not null default 'Active'
    check (account_status in ('Active', 'Inactive', 'Suspended', 'Pending')),
  created_at timestamptz not null default now()
);

-- Auto-create a public.users row whenever someone signs up via Supabase Auth.
create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (auth_user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Resolves the calling request's row in public.users from the Supabase Auth session.
create function public.current_user_id()
returns bigint
language sql
stable security definer set search_path = public
as $$
  select user_id from public.users where auth_user_id = auth.uid();
$$;

create function public.current_user_role()
returns text
language sql
stable security definer set search_path = public
as $$
  select role from public.users where auth_user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- USER_PREFERENCE
-- ---------------------------------------------------------------------------
create table public.user_preferences (
  preference_id bigint generated always as identity primary key,
  user_id bigint not null references public.users (user_id) on delete cascade,
  travel_interest text,
  preferred_activity text,
  preferred_region text
);

-- ---------------------------------------------------------------------------
-- TOURISM_CONTENT
-- ---------------------------------------------------------------------------
create table public.tourism_content (
  content_id bigint generated always as identity primary key,
  title text not null,
  content_type text not null
    check (content_type in ('Attraction', 'Destination', 'Event', 'Accommodation', 'Tour', 'Experience')),
  description text,
  location text,
  category text,
  status text not null default 'Draft'
    check (status in ('Draft', 'Pending Approval', 'Published', 'Archived', 'Inactive')),
  image_url text, -- addition: photo shown on cards (not in the dictionary)
  event_datetime timestamptz, -- addition: sortable date/time for content_type = 'Event'
  updated_by bigint references public.users (user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TRIP / TRIP_ITEM
-- ---------------------------------------------------------------------------
create table public.trips (
  trip_id bigint generated always as identity primary key,
  user_id bigint not null references public.users (user_id) on delete cascade,
  trip_name text not null,
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create table public.trip_items (
  trip_item_id bigint generated always as identity primary key,
  trip_id bigint not null references public.trips (trip_id) on delete cascade,
  content_id bigint not null references public.tourism_content (content_id) on delete cascade,
  planned_date date
);

-- ---------------------------------------------------------------------------
-- SAVED_ITEM
-- ---------------------------------------------------------------------------
create table public.saved_items (
  saved_item_id bigint generated always as identity primary key,
  user_id bigint not null references public.users (user_id) on delete cascade,
  content_id bigint not null references public.tourism_content (content_id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (user_id, content_id)
);

-- ---------------------------------------------------------------------------
-- RECOMMENDATION
-- ---------------------------------------------------------------------------
create table public.recommendations (
  recommendation_id bigint generated always as identity primary key,
  user_id bigint not null references public.users (user_id) on delete cascade,
  content_id bigint not null references public.tourism_content (content_id) on delete cascade,
  recommendation_reason text,
  recommendation_score double precision,
  generated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- EXTERNAL_DATA
-- ---------------------------------------------------------------------------
create table public.external_data (
  external_data_id bigint generated always as identity primary key,
  content_id bigint not null references public.tourism_content (content_id) on delete cascade,
  source_type text,
  source_name text,
  data_value text,
  retrieved_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- NOTIFICATION
-- ---------------------------------------------------------------------------
create table public.notifications (
  notification_id bigint generated always as identity primary key,
  user_id bigint not null references public.users (user_id) on delete cascade,
  notification_type text,
  message text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.user_preferences enable row level security;
alter table public.tourism_content enable row level security;
alter table public.trips enable row level security;
alter table public.trip_items enable row level security;
alter table public.saved_items enable row level security;
alter table public.recommendations enable row level security;
alter table public.external_data enable row level security;
alter table public.notifications enable row level security;

-- USER: read/update your own row only.
create policy "users read own row" on public.users
  for select using (auth_user_id = auth.uid());
create policy "users update own row" on public.users
  for update using (auth_user_id = auth.uid());

-- USER_PREFERENCE: fully owner-scoped.
create policy "own preferences" on public.user_preferences
  for all using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

-- TRIP: fully owner-scoped.
create policy "own trips" on public.trips
  for all using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

-- TRIP_ITEM: scoped via the parent trip's owner.
create policy "own trip items" on public.trip_items
  for all using (
    exists (select 1 from public.trips t where t.trip_id = trip_id and t.user_id = public.current_user_id())
  )
  with check (
    exists (select 1 from public.trips t where t.trip_id = trip_id and t.user_id = public.current_user_id())
  );

-- SAVED_ITEM: fully owner-scoped.
create policy "own saved items" on public.saved_items
  for all using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

-- RECOMMENDATION: read-only for the user it targets (generated by the system/staff tooling).
create policy "own recommendations" on public.recommendations
  for select using (user_id = public.current_user_id());

-- NOTIFICATION: fully owner-scoped (read + mark-as-read).
create policy "own notifications" on public.notifications
  for all using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

-- TOURISM_CONTENT: public can read published content; NTG Staff/Administrator manage all content.
create policy "public reads published content" on public.tourism_content
  for select using (status = 'Published');
create policy "staff read all content" on public.tourism_content
  for select using (public.current_user_role() in ('NTG Staff', 'Administrator'));
create policy "staff manage content" on public.tourism_content
  for insert with check (public.current_user_role() in ('NTG Staff', 'Administrator'));
create policy "staff update content" on public.tourism_content
  for update using (public.current_user_role() in ('NTG Staff', 'Administrator'));
create policy "staff delete content" on public.tourism_content
  for delete using (public.current_user_role() in ('NTG Staff', 'Administrator'));

-- EXTERNAL_DATA: public read (weather/maps/travel-time info attached to published content).
create policy "public reads external data" on public.external_data
  for select using (
    exists (select 1 from public.tourism_content c where c.content_id = content_id and c.status = 'Published')
  );
