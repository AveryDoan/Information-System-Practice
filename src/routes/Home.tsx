import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTourismContent } from '../hooks/useTourismContent'

export function Home() {
  const destinations = useTourismContent('Destination')
  const events = useTourismContent('Event')

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-bold text-ink">G'day, Avery</p>
          <p className="text-xs text-muted">📍 Darwin, Northern Territory</p>
        </div>
        <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-amber to-rust" />
      </div>

      {/* AI search bar */}
      <Link
        to="/chat"
        className="flex items-center gap-2 rounded-[28px] border border-border-soft bg-white px-4 py-3.5 text-muted"
      >
        <Search size={16} />
        <span className="text-[13px]">Ask me anything about the Territory…</span>
      </Link>

      {/* Hero AI card */}
      <div className="flex flex-col gap-2.5 rounded-[20px] bg-teal px-5 py-[22px]">
        <p className="text-base font-bold text-white">✨ Let AI plan your trip</p>
        <p className="text-xs text-[#e5edeb]">
          Tell us your vibe: wildlife, hidden gems, culture or family fun — and we'll build a day-by-day itinerary
          with maps, timing and events.
        </p>
        <Link
          to="/plan/who"
          className="mt-1 self-start rounded-[20px] bg-amber px-4 py-2.5 text-xs font-semibold text-ink"
        >
          Start planning →
        </Link>
      </div>

      {/* Discover now */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Discover now</h2>
          <Link to="/explore" className="text-xs font-semibold text-rust">
            See all
          </Link>
        </div>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5">
          {destinations.isLoading && <p className="text-xs text-muted">Loading destinations…</p>}
          {destinations.isError && <p className="text-xs text-rust">Couldn't load destinations.</p>}
          {destinations.data?.map((d) => (
            <Link
              key={d.content_id}
              to={`/destination/${d.content_id}`}
              className="relative h-[110px] w-[150px] shrink-0 overflow-hidden rounded-2xl"
            >
              {d.image_url && (
                <img src={d.image_url} alt="" className="absolute inset-0 size-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/55" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-white">{d.title}</p>
                <p className="text-[11px] text-white">{d.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Events near you */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Events near you</h2>
          <Link to="/events" className="text-xs font-semibold text-rust">
            See all
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {events.isLoading && <p className="text-xs text-muted">Loading events…</p>}
          {events.isError && <p className="text-xs text-rust">Couldn't load events.</p>}
          {events.data?.map((e) => {
            const date = e.event_datetime ? new Date(e.event_datetime) : null
            return (
              <Link
                key={e.content_id}
                to={`/destination/${e.content_id}`}
                className="flex items-center gap-3 rounded-2xl border border-border-card bg-white py-3 pl-3 pr-4"
              >
                <div className="flex shrink-0 flex-col items-center rounded-[10px] bg-chip px-2.5 py-1.5 text-rust">
                  <p className="text-sm font-bold">{date ? date.getDate() : '–'}</p>
                  <p className="text-[10px] font-semibold uppercase">
                    {date ? date.toLocaleString('en-AU', { month: 'short' }) : ''}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold text-ink">{e.title}</p>
                  <p className="text-[11px] text-muted">
                    {e.location}
                    {date ? ` · ${date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}` : ''}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
