import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSavedIds } from '../hooks/useSavedIds'
import { useTourismContent } from '../hooks/useTourismContent'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

// Simplification: a button-driven card stack rather than real drag/gesture
// physics — same "swipe to save" idea, much less to get wrong.
export function DiscoverSwipe() {
  const { session, profile } = useAuth()
  const content = useTourismContent()
  const savedIds = useSavedIds()
  const queryClient = useQueryClient()
  const [index, setIndex] = useState(0)

  const deck = useMemo(
    () => (content.data ?? []).filter((item) => !savedIds.data?.has(item.content_id)),
    [content.data, savedIds.data],
  )

  const save = useMutation({
    mutationFn: async (contentId: number) => {
      if (!profile) return
      const { error } = await supabase.from('saved_items').insert({ user_id: profile.user_id, content_id: contentId })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved_items'] }),
  })

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 pt-20 text-center">
        <p className="text-sm text-muted">Log in to start discovering.</p>
        <Link to="/login" className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white">
          Log in
        </Link>
      </div>
    )
  }

  if (content.isLoading) return <p className="px-5 pt-14 text-sm text-muted">Loading…</p>

  const current = deck[index]
  const next = deck[index + 1]

  function handleSkip() {
    setIndex((i) => i + 1)
  }

  function handleSave() {
    if (current) save.mutate(current.content_id)
    setIndex((i) => i + 1)
  }

  return (
    <div className="flex h-full flex-col gap-5 px-5 pb-6 pt-14">
      <h1 className="text-xl font-bold text-ink">Discover</h1>

      <div className="relative flex-1">
        {!current && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted">That's everything for now.</p>
            <Link to="/trips" className="text-xs font-semibold text-rust">
              See your saved trips
            </Link>
          </div>
        )}

        {next && (
          <div className="absolute inset-0 scale-[0.96] rounded-3xl bg-border-card opacity-60" />
        )}

        {current && (
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-border-card bg-white">
            <div className="relative h-2/3 w-full bg-border-card">
              {current.image_url && <img src={current.image_url} alt="" className="size-full object-cover" />}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              {current.category && (
                <span className="w-fit rounded-full bg-chip px-2.5 py-1 text-[11px] font-semibold text-rust">
                  {current.category}
                </span>
              )}
              <p className="text-base font-bold text-ink">{current.title}</p>
              <p className="text-xs text-muted">{current.location}</p>
            </div>
          </div>
        )}
      </div>

      {current && (
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleSkip}
            className="flex size-14 items-center justify-center rounded-full border border-border-card bg-white"
          >
            <X size={22} color="#99918c" />
          </button>
          <button onClick={handleSave} className="flex size-14 items-center justify-center rounded-full bg-rust">
            <Heart size={22} color="white" fill="white" />
          </button>
        </div>
      )}
    </div>
  )
}
