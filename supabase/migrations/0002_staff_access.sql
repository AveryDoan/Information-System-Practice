-- Staff Portal support:
--   1. `recommendations` had no INSERT policy at all (RLS defaults to deny),
--      so nothing could ever write to it. The app didn't populate it either
--      — trip creation picked content directly. This adds the policy and
--      (in application code) starts writing a recommendation row alongside
--      each trip_item, so Recommendation Analytics has real data to show.
--   2. NTG Staff / Administrator need read access beyond tourism_content for
--      the Staff Portal's analytics screens (visitor counts, trip counts,
--      saved-item counts, recommendation stats). These are additional SELECT
--      policies — Postgres RLS ORs multiple policies for the same command —
--      so existing owner-only access for visitors is unaffected.

create policy "own recommendations insert" on public.recommendations
  for insert with check (user_id = public.current_user_id());

create policy "staff read all users" on public.users
  for select using (public.current_user_role() in ('NTG Staff', 'Administrator'));

create policy "staff read all trips" on public.trips
  for select using (public.current_user_role() in ('NTG Staff', 'Administrator'));

create policy "staff read all saved items" on public.saved_items
  for select using (public.current_user_role() in ('NTG Staff', 'Administrator'));

create policy "staff read all recommendations" on public.recommendations
  for select using (public.current_user_role() in ('NTG Staff', 'Administrator'));

create policy "staff manage recommendations" on public.recommendations
  for delete using (public.current_user_role() in ('NTG Staff', 'Administrator'));
