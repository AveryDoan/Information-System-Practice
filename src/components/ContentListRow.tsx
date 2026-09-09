import { Link } from 'react-router-dom'
import type { Database } from '../lib/database.types'

type ContentRow = Database['public']['Tables']['tourism_content']['Row']

/** Thumbnail + title + location row — used for Where to Stay/Eat/Do and Event Discovery lists. */
export function ContentListRow({ item }: { item: ContentRow }) {
  return (
    <Link
      to={`/destination/${item.content_id}`}
      className="flex items-center gap-3 rounded-2xl border border-border-card bg-white p-3"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-border-card">
        {item.image_url && <img src={item.image_url} alt="" className="size-full object-cover" />}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
        <p className="truncate text-xs text-muted">{item.location}</p>
        {item.category && (
          <span className="mt-1 w-fit rounded-full bg-chip px-2 py-0.5 text-[10px] font-semibold text-rust">
            {item.category}
          </span>
        )}
      </div>
    </Link>
  )
}
