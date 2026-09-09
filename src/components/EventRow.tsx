import { Link } from 'react-router-dom'
import type { Database } from '../lib/database.types'

type ContentRow = Database['public']['Tables']['tourism_content']['Row']

export function EventRow({ item }: { item: ContentRow }) {
  const date = item.event_datetime ? new Date(item.event_datetime) : null
  return (
    <Link
      to={`/destination/${item.content_id}`}
      className="flex items-center gap-3 rounded-2xl border border-border-card bg-white py-3 pl-3 pr-4"
    >
      <div className="flex shrink-0 flex-col items-center rounded-[10px] bg-chip px-2.5 py-1.5 text-rust">
        <p className="text-sm font-bold">{date ? date.getDate() : '–'}</p>
        <p className="text-[10px] font-semibold uppercase">
          {date ? date.toLocaleString('en-AU', { month: 'short' }) : ''}
        </p>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-ink">{item.title}</p>
        <p className="text-[11px] text-muted">
          {item.location}
          {date ? ` · ${date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}` : ''}
        </p>
      </div>
    </Link>
  )
}
