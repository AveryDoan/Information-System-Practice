import { CategoryHero } from '../components/CategoryHero'
import { ContentListRow } from '../components/ContentListRow'
import { useTourismContent } from '../hooks/useTourismContent'
import { HERO_PHOTOS } from '../lib/heroPhotos'

// Simplification: the ERD's content_type doesn't have a "Restaurant" value,
// so "food" places are content_type Experience/Attraction/Tour with category = 'Food'.
export function WhereToEat() {
  const eats = useTourismContent({ category: 'Food' })

  return (
    <div className="flex flex-col">
      <CategoryHero photo={HERO_PHOTOS.market} title="Where to Eat" />
      <div className="flex flex-col gap-4 px-5 pb-6 pt-5">
        {eats.isLoading && <p className="text-sm text-muted">Loading…</p>}
        {eats.data?.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
        <div className="flex flex-col gap-3">
          {eats.data?.map((item) => (
            <ContentListRow key={item.content_id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
