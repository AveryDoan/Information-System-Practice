import { ArrowLeft, Heart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useContentById } from '../hooks/useContentById'
import { useIsSaved, useToggleSaved } from '../hooks/useSavedItems'
import { useAuth } from '../lib/auth'

export function DestinationDetail() {
  const { id } = useParams()
  const contentId = Number(id)
  const navigate = useNavigate()
  const { session } = useAuth()
  const content = useContentById(contentId)
  const isSaved = useIsSaved(contentId)
  const toggleSaved = useToggleSaved(contentId)

  if (content.isLoading) return <p className="px-5 pt-14 text-sm text-muted">Loading…</p>
  if (content.isError || !content.data) return <p className="px-5 pt-14 text-sm text-rust">Couldn't load this item.</p>

  const item = content.data
  const date = item.event_datetime ? new Date(item.event_datetime) : null

  return (
    <div className="flex flex-col pb-6">
      <div className="relative h-56 w-full bg-border-card">
        {item.image_url && <img src={item.image_url} alt="" className="size-full object-cover" />}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => (session ? toggleSaved.mutate() : navigate('/login'))}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90"
        >
          <Heart size={18} fill={isSaved.data ? '#c1440e' : 'none'} color="#c1440e" />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        {item.category && (
          <span className="w-fit rounded-full bg-chip px-2.5 py-1 text-[11px] font-semibold text-rust">
            {item.category}
          </span>
        )}
        <h1 className="text-xl font-bold text-ink">{item.title}</h1>
        <p className="text-xs text-muted">
          📍 {item.location}
          {date && ` · ${date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} at ${date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}`}
        </p>
        <p className="text-sm leading-relaxed text-ink">{item.description}</p>

        {session ? (
          <Link
            to="/plan/who"
            className="mt-2 self-start rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white"
          >
            Add to a trip
          </Link>
        ) : (
          <Link to="/login" className="mt-2 self-start rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white">
            Log in to save or plan
          </Link>
        )}
      </div>
    </div>
  )
}
