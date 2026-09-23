import { Link } from 'react-router-dom'
import { TripItinerary } from '../components/TripItinerary'
import { useTrip, useTrips } from '../hooks/useTrips'
import { useAuth } from '../lib/auth'

/** Shows the itinerary for the user's most recent trip — the bottom-nav "Itinerary" tab. */
export function RecommendedItinerary() {
  const { session } = useAuth()
  const trips = useTrips()
  const latestTripId = trips.data?.[0]?.trip_id
  const trip = useTrip(latestTripId ?? NaN)

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 pt-20 text-center">
        <p className="text-sm text-muted">Log in to see your itinerary.</p>
        <Link to="/login" className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white">
          Log in
        </Link>
      </div>
    )
  }

  if (trips.isLoading) return <p className="px-5 pt-14 text-sm text-muted">Loading…</p>

  if (!latestTripId) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 pt-20 text-center">
        <p className="text-sm text-muted">No trip planned yet.</p>
        <Link to="/plan/who" className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white">
          Start planning
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-14">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="heading text-2xl text-ink">Your Itinerary</h1>
          <p className="text-xs text-muted">{trip.data?.trip.trip_name}</p>
        </div>
        <Link to="/itinerary/map" className="shrink-0 text-xs font-semibold text-rust">
          View on map
        </Link>
      </div>
      {trip.data && <TripItinerary items={trip.data.items} />}
    </div>
  )
}
