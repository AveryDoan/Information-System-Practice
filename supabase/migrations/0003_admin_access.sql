-- System Administrator portal support.
--
-- "Manage Roles & Permissions" (Figma A4) has no real backing beyond the
-- `role` column already on USER — there's no separate permissions table in
-- the data dictionary — so it's merged into "Manage Users & Access" (A3) as
-- one screen. This migration is what makes that screen's role/status edits
-- actually work: there was no policy letting anyone update another user's row.
--
-- "Third-Party Integrations" (A6) reuses EXTERNAL_DATA for real records
-- instead of being a fully mocked screen — each distinct source_name is
-- treated as one "integration". Admin gets full CRUD; the existing
-- public-read-if-published policy is untouched.

create policy "admin update any user" on public.users
  for update using (public.current_user_role() = 'Administrator');

create policy "admin manage external data" on public.external_data
  for all using (public.current_user_role() = 'Administrator')
  with check (public.current_user_role() = 'Administrator');
