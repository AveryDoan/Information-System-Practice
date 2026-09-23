import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentCard } from '../components/ContentCard'
import { EventRow } from '../components/EventRow'
import { SectionHeader } from '../components/SectionHeader'
import { useTourismContent } from '../hooks/useTourismContent'
import { useAuth } from '../lib/auth'
import { HERO_PHOTOS } from '../lib/heroPhotos'

export function Home() {
  const destinations = useTourismContent('Destination')
  const events = useTourismContent('Event')
  const { session, profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="heading text-xl text-ink">{firstName ? `G'day, ${firstName}` : "G'day!"}</p>
          <p className="text-xs text-muted">📍 Darwin, Northern Territory</p>
        </div>
        <Link
          to={session ? '/profile' : '/login'}
          className="size-10 shrink-0 rounded-full bg-gradient-to-br from-amber to-rust"
        />
      </div>

      {/* AI search bar */}
      <Link
        to="/chat"
        className="flex items-center gap-2 rounded-[28px] border border-border-soft bg-white px-4 py-3.5 text-muted"
      >
        <Search size={16} />
        <span className="text-[13px]">Ask me anything about the Territory…</span>
      </Link>

      {/* Hero AI card — background photo + brand-tinted scrim, southaustralia.com/app-style */}
      <div className="relative flex flex-col gap-2.5 overflow-hidden rounded-[20px] px-5 py-[22px]">
        <img src={HERO_PHOTOS.kakadu} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-teal/70" />
        <p className="heading relative text-xl text-white">✨ Let AI plan your trip</p>
        <p className="relative text-xs text-[#e8dccb]">
          Tell us your vibe: wildlife, hidden gems, culture or family fun — and we'll build a day-by-day itinerary
          with maps, timing and events.
        </p>
        <div className="relative mt-1 flex items-center gap-4">
          <Link to="/plan/who" className="self-start rounded-[20px] bg-amber px-4 py-2.5 text-xs font-semibold text-ink">
            Start planning →
          </Link>
          <Link to="/planner" className="text-xs font-semibold text-white underline underline-offset-2">
            Or describe your trip
          </Link>
        </div>
      </div>

      {/* Discover now */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Discover now" to="/explore" />
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5">
          {destinations.isLoading && <p className="text-xs text-muted">Loading destinations…</p>}
          {destinations.isError && <p className="text-xs text-rust">Couldn't load destinations.</p>}
          {destinations.data?.map((d) => (
            <ContentCard key={d.content_id} item={d} />
          ))}
        </div>
      </section>

      {/* Events near you */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Events near you" to="/events" />
        <div className="flex flex-col gap-3">
          {events.isLoading && <p className="text-xs text-muted">Loading events…</p>}
          {events.isError && <p className="text-xs text-rust">Couldn't load events.</p>}
          {events.data?.map((e) => (
            <EventRow key={e.content_id} item={e} />
          ))}
        </div>
      </section>
    </div>
  )
}
