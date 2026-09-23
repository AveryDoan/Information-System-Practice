import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTrip } from '../hooks/useTrips'
import { inferInterestsFromPrompt } from '../lib/ai'

function defaultDateRange() {
  const start = new Date(Date.now() + 7 * 86400000)
  const end = new Date(Date.now() + 10 * 86400000)
  const toISO = (d: Date) => d.toISOString().slice(0, 10)
  return { startDate: toISO(start), endDate: toISO(end) }
}

const EXAMPLES = [
  'Wildlife and hidden gems, nothing too touristy',
  'Family trip with easy walks and good food',
  'Culture, festivals and local markets',
]

export function ItineraryPlanner() {
  const [prompt, setPrompt] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const createTrip = useCreateTrip()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || thinking) return
    setError(null)
    setThinking(true)
    try {
      const interests = await inferInterestsFromPrompt(prompt)
      const { startDate, endDate } = defaultDateRange()
      const trip = await createTrip.mutateAsync({ startDate, endDate, budgetLevel: 'Comfort', interests })
      navigate(`/trip/${trip.trip_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build your itinerary.')
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-14">
      <div className="flex flex-col gap-1">
        <h1 className="heading text-2xl text-ink">✨ Smart Itinerary Planner</h1>
        <p className="text-sm text-muted">
          Describe your trip in one sentence — we'll match it to real Northern Territory destinations and events.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="e.g. Wildlife and hidden gems, nothing too touristy"
          className="resize-none rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
        />
        {error && <p className="text-xs text-rust">{error}</p>}
        <button
          type="submit"
          disabled={!prompt.trim() || thinking}
          className="rounded-2xl bg-teal px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {thinking ? 'Building your itinerary…' : 'Generate itinerary'}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Try one of these</p>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            onClick={() => setPrompt(example)}
            className="rounded-2xl border border-border-card bg-white px-4 py-3 text-left text-sm text-ink"
          >
            {example}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-muted">
        Demo note: a keyword match stands in for a real model for now — see src/lib/ai.ts.
      </p>
    </div>
  )
}
