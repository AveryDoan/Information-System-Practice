import { CategoryHero } from '../components/CategoryHero'
import { EventRow } from '../components/EventRow'
import { useTourismContent } from '../hooks/useTourismContent'
import { HERO_PHOTOS } from '../lib/heroPhotos'

export function EventDiscovery() {
  const events = useTourismContent({ contentType: 'Event' })

  return (
    <div className="flex flex-col">
      <CategoryHero photo={HERO_PHOTOS.festival} title="Events near you" />
      <div className="flex flex-col gap-4 px-5 pb-6 pt-5">
        {events.isLoading && <p className="text-sm text-muted">Loading events…</p>}
        {events.isError && <p className="text-sm text-rust">Couldn't load events.</p>}
        {events.data?.length === 0 && <p className="text-sm text-muted">No events published yet.</p>}
        <div className="flex flex-col gap-3">
          {events.data?.map((e) => (
            <EventRow key={e.content_id} item={e} />
          ))}
        </div>
      </div>
    </div>
  )
}
