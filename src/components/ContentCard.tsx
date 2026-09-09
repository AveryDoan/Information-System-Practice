import { Link } from 'react-router-dom'
import type { Database } from '../lib/database.types'

type ContentRow = Database['public']['Tables']['tourism_content']['Row']

/** Horizontal-scroll photo tile — used for "Discover now" and similar rows. */
export function ContentCard({ item }: { item: ContentRow }) {
  return (
    <Link
      to={`/destination/${item.content_id}`}
      className="relative h-[110px] w-[150px] shrink-0 overflow-hidden rounded-2xl"
    >
      {item.image_url && <img src={item.image_url} alt="" className="absolute inset-0 size-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/55" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-white">{item.title}</p>
        <p className="text-[11px] text-white">{item.location}</p>
      </div>
    </Link>
  )
}
