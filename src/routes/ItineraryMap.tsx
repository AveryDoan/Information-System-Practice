import '../lib/leafletIcons'
import 'leaflet/dist/leaflet.css'

import type { LatLngBoundsExpression } from 'leaflet'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { TripItinerary } from '../components/TripItinerary'
import { useTrip, useTrips } from '../hooks/useTrips'
import { coordsFor } from '../lib/locationCoords'
import { useAuth } from '../lib/auth'

export function ItineraryMap() {
  const { session } = useAuth()
  const trips = useTrips()
  const latestTripId = trips.data?.[0]?.trip_id
  const trip = useTrip(latestTripId ?? NaN)

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 pt-20 text-center">
        <p className="text-sm text-muted">Log in to see your itinerary on the map.</p>
        <Link to="/login" className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white">
          Log in
        </Link>
      </div>
    )
  }

  if (trips.isLoading) return <p className="px-5 pt-14 text-sm text-muted">Loading…</p>

  if (!latestTripId || !trip.data) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 pt-20 text-center">
        <p className="text-sm text-muted">No trip planned yet.</p>
        <Link to="/plan/who" className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white">
          Start planning
        </Link>
      </div>
    )
  }

  const itemsWithContent = trip.data.items.filter((i) => i.content)

  // Day numbers follow the same first-seen order as TripItinerary's grouping,
  // so "Day 2" here means the same thing as "Day 2" in the list below.
  const dayNumberByDate = new Map<string, number>()
  for (const item of itemsWithContent) {
    const key = item.planned_date ?? 'Unscheduled'
    if (!dayNumberByDate.has(key)) dayNumberByDate.set(key, dayNumberByDate.size + 1)
  }

  // Fan out repeats of the same location so markers don't stack exactly.
  const seenCounts = new Map<string, number>()
  const points = itemsWithContent.map((item) => {
    const key = item.content!.location ?? '__unmapped'
    const occurrence = seenCounts.get(key) ?? 0
    seenCounts.set(key, occurrence + 1)
    return {
      item,
      coord: coordsFor(item.content!.location, occurrence),
      day: dayNumberByDate.get(item.planned_date ?? 'Unscheduled')!,
    }
  })

  const bounds: LatLngBoundsExpression | undefined = points.length
    ? (points.map((p) => p.coord) as LatLngBoundsExpression)
    : undefined

  return (
    <div className="flex flex-col gap-4 pb-6 pt-14">
      <div className="flex flex-col gap-1 px-5">
        <h1 className="heading text-2xl text-ink">Itinerary Map</h1>
        <p className="text-xs text-muted">{trip.data.trip.trip_name}</p>
        <p className="text-[11px] text-muted">📍 Map pins use approximate demo coordinates, not live geocoding.</p>
      </div>

      <div className="h-[320px] w-full overflow-hidden">
        <MapContainer bounds={bounds} boundsOptions={{ padding: [24, 24] }} className="size-full" scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={points.map((p) => p.coord)} pathOptions={{ color: '#e88244', weight: 3 }} />
          {points.map(({ item, coord, day }) => (
            <Marker key={item.trip_item_id} position={coord}>
              <Popup>
                Day {day} · {item.content!.title}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="px-5">
        <TripItinerary items={trip.data.items} />
      </div>
    </div>
  )
}
