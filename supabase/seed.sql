-- Sample published tourism content so the visitor app isn't empty out of the box.
-- Run after 0001_init.sql. Safe to re-run (guarded by title match).

insert into public.tourism_content (title, content_type, description, location, category, status, image_url, event_datetime)
select * from (values
  ('Uluru', 'Destination', 'The spiritual heart of Australia''s Red Centre, sacred to the Anangu people.', 'Red Centre', 'Nature', 'Published', 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800', null::timestamptz),
  ('Kakadu National Park', 'Destination', 'A World Heritage-listed wetland and escarpment landscape rich in wildlife and rock art.', 'Kakadu', 'Nature', 'Published', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', null),
  ('Litchfield National Park', 'Destination', 'Waterfalls, swimming holes and monsoon rainforest a short drive from Darwin.', 'Litchfield', 'Nature', 'Published', 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', null),
  ('Darwin Festival', 'Event', 'Darwin''s annual celebration of music, theatre, comedy and visual arts.', 'Darwin CBD', 'Culture', 'Published', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', (current_date + interval '5 days' + time '18:00')::timestamptz),
  ('Mindil Beach Sunset Markets', 'Event', 'Food stalls, craft stalls and live music on the sand as the sun sets over the harbour.', 'Mindil Beach', 'Food', 'Published', 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800', (current_date + interval '12 days' + time '16:00')::timestamptz),
  ('Cicada Lodge', 'Accommodation', 'Boutique riverside lodge on Nitmiluk (Katherine Gorge).', 'Katherine', 'Family', 'Published', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', null),
  ('Jumping Crocodile Cruise', 'Tour', 'Guided boat tour spotting saltwater crocodiles on the Adelaide River.', 'Adelaide River', 'Wildlife', 'Published', 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800', null),
  ('Parap Village Market', 'Experience', 'Multicultural Saturday market known for its laksa and tropical produce.', 'Parap', 'Food', 'Published', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', null)
) as v(title, content_type, description, location, category, status, image_url, event_datetime)
where not exists (
  select 1 from public.tourism_content c where c.title = v.title
);
