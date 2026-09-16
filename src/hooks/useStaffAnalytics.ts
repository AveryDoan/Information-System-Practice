import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

async function count(table: 'tourism_content' | 'users' | 'trips' | 'saved_items', filter?: [string, string]) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) query = query.eq(filter[0], filter[1])
  const { count: n, error } = await query
  if (error) throw error
  return n ?? 0
}

/** Real aggregate counts for the Staff Dashboard overview cards. */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['staff_dashboard_stats'],
    queryFn: async () => {
      const [publishedCount, pendingCount, visitorCount, tripCount, savedCount] = await Promise.all([
        count('tourism_content', ['status', 'Published']),
        count('tourism_content', ['status', 'Pending Approval']),
        count('users', ['role', 'Visitor']),
        count('trips'),
        count('saved_items'),
      ])
      return { publishedCount, pendingCount, visitorCount, tripCount, savedCount }
    },
  })
}

/** Visitor Engagement Analytics: real counts plus the most-saved destinations, tallied client-side. */
export function useEngagementStats() {
  return useQuery({
    queryKey: ['staff_engagement_stats'],
    queryFn: async () => {
      const [visitorCount, tripCount, savedCount] = await Promise.all([
        count('users', ['role', 'Visitor']),
        count('trips'),
        count('saved_items'),
      ])

      const { data: saved, error } = await supabase.from('saved_items').select('content_id')
      if (error) throw error

      const tally = new Map<number, number>()
      for (const s of saved) tally.set(s.content_id, (tally.get(s.content_id) ?? 0) + 1)
      const topIds = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id)

      const content = topIds.length
        ? (await supabase.from('tourism_content').select('content_id, title').in('content_id', topIds)).data ?? []
        : []

      const topSaved = topIds.map((id) => ({
        contentId: id,
        title: content.find((c) => c.content_id === id)?.title ?? 'Unknown',
        count: tally.get(id)!,
      }))

      return { visitorCount, tripCount, savedCount, topSaved }
    },
  })
}

/** Recommendation Analytics & Trends + the raw rows for Update Recommendation Data. */
export function useRecommendationStats() {
  return useQuery({
    queryKey: ['staff_recommendation_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(50)
      if (error) throw error

      const contentIds = [...new Set(data.map((r) => r.content_id))]
      const content = contentIds.length
        ? (await supabase.from('tourism_content').select('content_id, title, category').in('content_id', contentIds)).data ?? []
        : []

      const rows = data.map((r) => ({ ...r, content: content.find((c) => c.content_id === r.content_id) ?? null }))

      const avgScore = data.length ? data.reduce((sum, r) => sum + (r.recommendation_score ?? 0), 0) / data.length : 0

      const categoryTally = new Map<string, number>()
      for (const r of rows) {
        const cat = r.content?.category ?? 'Uncategorised'
        categoryTally.set(cat, (categoryTally.get(cat) ?? 0) + 1)
      }

      return {
        rows,
        totalCount: data.length,
        avgScore,
        byCategory: [...categoryTally.entries()].sort((a, b) => b[1] - a[1]),
      }
    },
  })
}

export function useDeleteRecommendation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (recommendationId: number) => {
      const { error } = await supabase.from('recommendations').delete().eq('recommendation_id', recommendationId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff_recommendation_stats'] }),
  })
}
