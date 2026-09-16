import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/**
 * Only the database check here is real (an actual round-trip, timed). There's
 * no real app server/CDN/uptime infrastructure behind this prototype to
 * report on, so the rest is fixed demo data — the UI labels it as such rather
 * than pretending it's live.
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: ['admin_system_health'],
    queryFn: async () => {
      const start = performance.now()
      const { error } = await supabase.from('tourism_content').select('content_id', { head: true, count: 'exact' }).limit(1)
      const latencyMs = Math.round(performance.now() - start)

      return {
        database: { ok: !error, latencyMs },
        checkedAt: new Date().toISOString(),
      }
    },
    refetchInterval: 30000,
  })
}
