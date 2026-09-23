import { Link } from 'react-router-dom'
import { useTrips } from '../hooks/useTrips'

export function MyTrips() {
  const trips = useTrips()

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-14">
      <div className="flex items-center justify-between">
        <h1 className="heading text-2xl text-ink">My Trips</h1>
        <Link to="/plan/who" className="text-xs font-semibold text-rust">
          + New trip
        </Link>
      </div>

      {trips.isLoading && <p className="text-sm text-muted">Loading…</p>}
      {trips.data?.length === 0 && (
        <p className="text-sm text-muted">No trips yet — start planning one from the home screen.</p>
      )}

      <div className="flex flex-col gap-3">
        {trips.data?.map((trip) => (
          <Link
            key={trip.trip_id}
            to={`/trip/${trip.trip_id}`}
            className="flex flex-col gap-1 rounded-2xl border border-border-card bg-white p-4"
          >
            <p className="text-sm font-semibold text-ink">{trip.trip_name}</p>
            <p className="text-xs text-muted">
              {trip.start_date && new Date(trip.start_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              {' – '}
              {trip.end_date && new Date(trip.end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
