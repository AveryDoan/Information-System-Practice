import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { StaffLayout } from '../../components/staff/StaffLayout'
import { useContentById } from '../../hooks/useContentById'
import { useSaveContent, type ContentFormValues } from '../../hooks/useStaffContent'
import type { ContentStatus, ContentType } from '../../lib/database.types'

const CONTENT_TYPES: ContentType[] = ['Attraction', 'Destination', 'Event', 'Accommodation', 'Tour', 'Experience']
const STATUSES: ContentStatus[] = ['Draft', 'Pending Approval', 'Published', 'Archived', 'Inactive']

const EMPTY: ContentFormValues = {
  title: '',
  content_type: 'Destination',
  description: '',
  location: '',
  category: '',
  status: 'Draft',
  image_url: '',
  event_datetime: '',
}

export function EditContent() {
  const { id } = useParams()
  const contentId = id ? Number(id) : undefined
  const isProvider = useLocation().pathname.startsWith('/staff/providers')
  const listPath = isProvider ? '/staff/providers' : '/staff/content'
  const navigate = useNavigate()

  const existing = useContentById(contentId ?? NaN)
  const save = useSaveContent(contentId)
  const [values, setValues] = useState<ContentFormValues>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!existing.data) return
    setValues({
      title: existing.data.title,
      content_type: existing.data.content_type,
      description: existing.data.description ?? '',
      location: existing.data.location ?? '',
      category: existing.data.category ?? '',
      status: existing.data.status,
      image_url: existing.data.image_url ?? '',
      event_datetime: existing.data.event_datetime?.slice(0, 16) ?? '',
    })
  }, [existing.data])

  function set<K extends keyof ContentFormValues>(key: K, value: ContentFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await save.mutateAsync(values)
      navigate(listPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
    }
  }

  if (contentId && existing.isLoading) {
    return <StaffLayout title="Loading…">{null}</StaffLayout>
  }

  return (
    <StaffLayout title={contentId ? `Edit ${isProvider ? 'Provider' : 'Destination'}` : `New ${isProvider ? 'Provider' : 'Content'}`}>
      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Title</span>
          <input
            required
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Type</span>
            <select
              value={values.content_type}
              onChange={(e) => set('content_type', e.target.value as ContentType)}
              className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Status</span>
            <select
              value={values.status}
              onChange={(e) => set('status', e.target.value as ContentStatus)}
              className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Location</span>
            <input
              value={values.location}
              onChange={(e) => set('location', e.target.value)}
              className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Category</span>
            <input
              value={values.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="Nature, Culture, Wildlife, Food, Family…"
              className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Description</span>
          <textarea
            rows={4}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            className="resize-none rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Image URL</span>
          <input
            value={values.image_url}
            onChange={(e) => set('image_url', e.target.value)}
            placeholder="https://…"
            className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </label>

        {values.content_type === 'Event' && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Event date & time</span>
            <input
              type="datetime-local"
              value={values.event_datetime}
              onChange={(e) => set('event_datetime', e.target.value)}
              className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>
        )}

        {error && <p className="text-sm text-rust">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={save.isPending}
            className="rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {save.isPending ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate(listPath)}
            className="rounded-lg border border-border-card bg-white px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    </StaffLayout>
  )
}
