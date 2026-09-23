import { CategoryHero } from '../components/CategoryHero'
import { ContentListRow } from '../components/ContentListRow'
import { useTourismContent } from '../hooks/useTourismContent'
import { HERO_PHOTOS } from '../lib/heroPhotos'

export function WhereToStay() {
  const stays = useTourismContent({ contentType: 'Accommodation' })

  return (
    <div className="flex flex-col">
      <CategoryHero photo={HERO_PHOTOS.lodge} title="Where to Stay" />
      <div className="flex flex-col gap-4 px-5 pb-6 pt-5">
        {stays.isLoading && <p className="text-sm text-muted">Loading…</p>}
        {stays.data?.length === 0 && <p className="text-sm text-muted">No accommodation listed yet.</p>}
        <div className="flex flex-col gap-3">
          {stays.data?.map((item) => (
            <ContentListRow key={item.content_id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
