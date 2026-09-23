import { Link, useParams } from 'react-router-dom'
import { TripItinerary } from '../components/TripItinerary'
import { useTrip } from '../hooks/useTrips'

export function TripDashboard() {
  const { tripId } = useParams()
  const trip = useTrip(Number(tripId))

  if (trip.isLoading) return <p className="px-5 pt-14 text-sm text-muted">Loading trip…</p>
  if (trip.isError || !trip.data) return <p className="px-5 pt-14 text-sm text-rust">Couldn't load this trip.</p>

  const { trip: tripRow, items } = trip.data

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-14">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="heading text-2xl text-ink">{tripRow.trip_name}</h1>
          <p className="text-xs text-muted">
            {tripRow.start_date && new Date(tripRow.start_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            {' – '}
            {tripRow.end_date && new Date(tripRow.end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <Link to="/itinerary/map" className="shrink-0 text-xs font-semibold text-rust">
          View on map
        </Link>
      </div>
      <TripItinerary items={items} />
    </div>
  )
}
