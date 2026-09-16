import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import type { BudgetLevel } from '../store/planTrip'

/** All trips belonging to the signed-in user, most recent first. */
export function useTrips() {
  const { profile } = useAuth()
  return useQuery({
    queryKey: ['trips', profile?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', profile!.user_id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(profile),
  })
}

/** A single trip plus its itinerary items, each joined with its tourism_content, grouped by day. */
export function useTrip(tripId: number) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const { data: trip, error: tripError } = await supabase.from('trips').select('*').eq('trip_id', tripId).single()
      if (tripError) throw tripError

      const { data: items, error: itemsError } = await supabase
        .from('trip_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('planned_date', { ascending: true })
      if (itemsError) throw itemsError

      const contentIds = items.map((i) => i.content_id)
      const content = contentIds.length
        ? (await supabase.from('tourism_content').select('*').in('content_id', contentIds)).data ?? []
        : []

      const itemsWithContent = items.map((item) => ({
        ...item,
        content: content.find((c) => c.content_id === item.content_id) ?? null,
      }))

      return { trip, items: itemsWithContent }
    },
    enabled: Number.isFinite(tripId),
  })
}

function eachDate(start: string, end: string): string[] {
  const dates: string[] = []
  const cursor = new Date(start)
  const last = new Date(end || start)
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates.length ? dates : [start]
}

interface CreateTripInput {
  startDate: string
  endDate: string
  budgetLevel: BudgetLevel
  interests: string[]
}

/**
 * Creates a trip and auto-fills a simple day-by-day itinerary by matching
 * published content to the chosen interests (categories). This stands in
 * for the "AI itinerary" until that's wired to a real model — see src/lib/ai.ts.
 */
export function useCreateTrip() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      if (!profile) throw new Error('You need to be logged in to plan a trip.')

      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: profile.user_id,
          trip_name: `Northern Territory trip · ${new Date(input.startDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}`,
          start_date: input.startDate,
          end_date: input.endDate,
        })
        .select()
        .single()
      if (tripError) throw tripError

      const days = eachDate(input.startDate, input.endDate)

      let candidateQuery = supabase.from('tourism_content').select('*').eq('status', 'Published')
      if (input.interests.length) candidateQuery = candidateQuery.in('category', input.interests)
      const { data: candidates } = await candidateQuery.limit(days.length * 2)

      const matchedByInterest = Boolean(candidates && candidates.length)
      const picks = matchedByInterest ? candidates! : (await supabase.from('tourism_content').select('*').eq('status', 'Published').limit(days.length * 2)).data ?? []

      if (picks.length) {
        const tripItems = picks.map((c, index) => ({
          trip_id: trip.trip_id,
          content_id: c.content_id,
          planned_date: days[index % days.length],
        }))
        const { error: itemsError } = await supabase.from('trip_items').insert(tripItems)
        if (itemsError) throw itemsError

        // Log why each item was suggested — gives the Staff Portal's
        // Recommendation Analytics screen real data instead of an empty table.
        const recommendations = picks.map((c) => ({
          user_id: profile.user_id,
          content_id: c.content_id,
          recommendation_reason: matchedByInterest
            ? `Matches interest: ${c.category ?? 'general'}`
            : 'No exact interest match — filled from general published content',
          recommendation_score: matchedByInterest ? 0.85 : 0.5,
        }))
        const { error: recError } = await supabase.from('recommendations').insert(recommendations)
        if (recError) throw recError
      }

      return trip
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', profile?.user_id] })
    },
  })
}
