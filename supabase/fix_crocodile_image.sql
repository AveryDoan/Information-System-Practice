-- One-off fix: the seeded image for "Jumping Crocodile Cruise" was actually a
-- photo of king penguins (never visually checked at seed time, only HTTP-status
-- checked). Run once in the SQL Editor; safe to delete afterwards.
update public.tourism_content set image_url = 'https://images.unsplash.com/photo-1578022556726-81b21ac91f98?w=800'
  where title = 'Jumping Crocodile Cruise';
