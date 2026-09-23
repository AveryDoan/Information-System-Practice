import { CategoryHero } from '../components/CategoryHero'
import { ContentListRow } from '../components/ContentListRow'
import { useTourismContent } from '../hooks/useTourismContent'
import { HERO_PHOTOS } from '../lib/heroPhotos'

// Simplification: "things to do" = Tours/Attractions/Experiences that aren't food places.
export function WhatToDo() {
  const activities = useTourismContent({ contentTypes: ['Tour', 'Attraction', 'Experience'], excludeCategory: 'Food' })

  return (
    <div className="flex flex-col">
      <CategoryHero photo={HERO_PHOTOS.crocodile} title="What to Do" />
      <div className="flex flex-col gap-4 px-5 pb-6 pt-5">
        {activities.isLoading && <p className="text-sm text-muted">Loading…</p>}
        {activities.data?.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
        <div className="flex flex-col gap-3">
          {activities.data?.map((item) => (
            <ContentListRow key={item.content_id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
