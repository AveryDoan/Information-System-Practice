import { EventRow } from '../components/EventRow'
import { useTourismContent } from '../hooks/useTourismContent'

export function EventDiscovery() {
  const events = useTourismContent({ contentType: 'Event' })

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-14">
      <h1 className="text-xl font-bold text-ink">Events near you</h1>
      {events.isLoading && <p className="text-sm text-muted">Loading events…</p>}
      {events.isError && <p className="text-sm text-rust">Couldn't load events.</p>}
      {events.data?.length === 0 && <p className="text-sm text-muted">No events published yet.</p>}
      <div className="flex flex-col gap-3">
        {events.data?.map((e) => (
          <EventRow key={e.content_id} item={e} />
        ))}
      </div>
    </div>
  )
}
