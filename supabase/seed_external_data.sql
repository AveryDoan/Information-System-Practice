-- Sample third-party integration records (EXTERNAL_DATA) so the Admin
-- portal's "Third-Party Integrations" screen has real rows to show.
-- Run once after seed.sql. Safe to re-run (guarded by source_name + content match).

insert into public.external_data (content_id, source_type, source_name, data_value, retrieved_at)
select c.content_id, v.source_type, v.source_name, v.data_value, now()
from (values
  ('Uluru', 'Weather', 'Bureau of Meteorology', '{"condition":"Sunny","tempC":28}'),
  ('Kakadu National Park', 'Weather', 'Bureau of Meteorology', '{"condition":"Storms","tempC":31}'),
  ('Darwin Festival', 'Map', 'OpenStreetMap', '{"lat":-12.4634,"lng":130.8456}')
) as v(title, source_type, source_name, data_value)
join public.tourism_content c on c.title = v.title
where not exists (
  select 1 from public.external_data e where e.content_id = c.content_id and e.source_name = v.source_name
);



-- Additional tourism_content: more regions (Alice Springs, Katherine, Kakadu,
-- Tiwi Islands, Barkly, Mary River) and fills in the Attraction type, which
-- the original seed.sql had none of. Categories are kept to the same five
-- used elsewhere (Nature, Culture, Wildlife, Food, Family) so all of this
-- content is reachable through the trip-planning interest matching, not just
-- direct browsing. Run after seed.sql — safe to re-run (guarded by title match).

insert into public.tourism_content (title, content_type, description, location, category, status, image_url, event_datetime)
select * from (values
  ('West MacDonnell Ranges', 'Destination', 'Dramatic gorges, waterholes and ridgelines stretching west from Alice Springs.', 'Red Centre', 'Nature', 'Published', 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800', null::timestamptz),
  ('Karlu Karlu / Devils Marbles', 'Destination', 'Giant granite boulders sacred to the Warumungu people, scattered across the outback plain.', 'Barkly Tablelands', 'Nature', 'Published', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800', null),
  ('East Point Reserve', 'Destination', 'Coastal reserve with WWII gun emplacements, walking trails and a monsoon vine forest.', 'Darwin', 'Nature', 'Published', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', null),

  ('Territory Wildlife Park', 'Attraction', 'Walk-through aviaries, a nocturnal house and a monsoon forest boardwalk showcasing NT wildlife.', 'Berry Springs', 'Wildlife', 'Published', 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800', null),
  ('Museum & Art Gallery of the NT', 'Attraction', 'Aboriginal art, natural sciences and the Cyclone Tracy exhibit, overlooking Darwin Harbour.', 'Darwin', 'Culture', 'Published', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800', null),
  ('George Brown Darwin Botanic Gardens', 'Attraction', 'Tropical gardens with a monsoon forest boardwalk and orchid collection, minutes from the CBD.', 'Darwin', 'Nature', 'Published', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', null),
  ('Crocosaurus Cove', 'Attraction', 'Home to Territory''s biggest crocs, with an underwater viewing tunnel in the CBD.', 'Darwin CBD', 'Wildlife', 'Published', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800', null),
  ('Something Wild Wildlife Park', 'Attraction', 'Hands-on wildlife encounters with rescued reptiles and native animals.', 'Noonamah', 'Wildlife', 'Published', 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', null),

  ('Alice Springs Beanie Festival', 'Event', 'A colourful celebration of handmade beanies and Central Australian craft culture.', 'Alice Springs', 'Culture', 'Published', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', (current_date + interval '20 days' + time '09:00')::timestamptz),
  ('Territory Day Fireworks', 'Event', 'Darwin''s harbourside fireworks display marking the anniversary of self-government.', 'Darwin Harbour', 'Culture', 'Published', 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800', (current_date + interval '30 days' + time '19:30')::timestamptz),

  ('Hilton Darwin', 'Accommodation', 'Harbour-view rooms a short walk from the Waterfront and Mindil Beach.', 'Darwin CBD', 'Family', 'Published', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', null),
  ('Alice Springs Desert Palms Resort', 'Accommodation', 'Palm-shaded bungalows with a pool, close to the Todd River.', 'Alice Springs', 'Family', 'Published', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', null),
  ('Wildman Wilderness Lodge', 'Accommodation', 'Safari-style cabins overlooking the Mary River wetlands.', 'Mary River', 'Nature', 'Published', 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800', null),

  ('Camel Tour Alice Springs', 'Tour', 'A gentle camel ride along the Todd River, a Red Centre tradition since the 1800s.', 'Alice Springs', 'Family', 'Published', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800', null),
  ('Nitmiluk Gorge Cruise', 'Tour', 'Boat cruise through the sandstone walls of Nitmiluk (Katherine) Gorge.', 'Katherine', 'Nature', 'Published', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', null),
  ('Kakadu Air Scenic Flight', 'Tour', 'A light-aircraft flight over Kakadu''s escarpments, wetlands and flood plains.', 'Kakadu', 'Nature', 'Published', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', null),

  ('Tiwi Islands Cultural Tour', 'Experience', 'A day trip to Bathurst Island to meet local artists and learn Tiwi culture and history.', 'Tiwi Islands', 'Culture', 'Published', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', null),
  ('Aboriginal Bush Tucker Experience', 'Experience', 'Guided walk through native bushland learning traditional food and medicine plants.', 'Darwin', 'Culture', 'Published', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800', null)
) as v(title, content_type, description, location, category, status, image_url, event_datetime)
where not exists (
  select 1 from public.tourism_content c where c.title = v.title
);
