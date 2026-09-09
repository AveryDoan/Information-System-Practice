import { ContentListRow } from '../components/ContentListRow'
import { useTourismContent } from '../hooks/useTourismContent'

export function WhereToStay() {
  const stays = useTourismContent({ contentType: 'Accommodation' })

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-14">
      <h1 className="text-xl font-bold text-ink">Where to Stay</h1>
      {stays.isLoading && <p className="text-sm text-muted">Loading…</p>}
      {stays.data?.length === 0 && <p className="text-sm text-muted">No accommodation listed yet.</p>}
      <div className="flex flex-col gap-3">
        {stays.data?.map((item) => (
          <ContentListRow key={item.content_id} item={item} />
        ))}
      </div>
    </div>
  )
}
