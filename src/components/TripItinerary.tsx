import { Link } from 'react-router-dom'
import type { Database } from '../lib/database.types'

type TripItemRow = Database['public']['Tables']['trip_items']['Row'] & {
  content: Database['public']['Tables']['tourism_content']['Row'] | null
}

export function TripItinerary({ items }: { items: TripItemRow[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">No itinerary items yet.</p>
  }

  const byDay = new Map<string, TripItemRow[]>()
  for (const item of items) {
    const key = item.planned_date ?? 'Unscheduled'
    byDay.set(key, [...(byDay.get(key) ?? []), item])
  }

  return (
    <div className="flex flex-col gap-5">
      {[...byDay.entries()].map(([day, dayItems], dayIndex) => (
        <div key={day} className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Day {dayIndex + 1} · {day === 'Unscheduled' ? day : new Date(day).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          {dayItems.map(
            (item) =>
              item.content && (
                <Link
                  key={item.trip_item_id}
                  to={`/destination/${item.content.content_id}`}
                  className="flex items-center gap-3 rounded-2xl border border-border-card bg-white p-3"
                >
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-border-card">
                    {item.content.image_url && (
                      <img src={item.content.image_url} alt="" className="size-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-sm font-semibold text-ink">{item.content.title}</p>
                    <p className="truncate text-xs text-muted">{item.content.location}</p>
                  </div>
                </Link>
              ),
          )}
        </div>
      ))}
    </div>
  )
}
