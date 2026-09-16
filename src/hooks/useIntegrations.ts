import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/**
 * "Third-Party Integrations" reuses EXTERNAL_DATA for real records instead of
 * being a fully mocked screen. Each row is one integration event; grouping by
 * source_name gives a "connected services" list with a real last-synced time.
 */
export function useIntegrations() {
  return useQuery({
    queryKey: ['admin_integrations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('external_data').select('*').order('retrieved_at', { ascending: false })
      if (error) throw error

      const contentIds = [...new Set(data.map((r) => r.content_id))]
      const content = contentIds.length
        ? (await supabase.from('tourism_content').select('content_id, title').in('content_id', contentIds)).data ?? []
        : []
      const rows = data.map((r) => ({ ...r, contentTitle: content.find((c) => c.content_id === r.content_id)?.title ?? 'Unknown' }))

      const bySource = new Map<string, { sourceType: string; count: number; lastSynced: string }>()
      for (const row of rows) {
        const existing = bySource.get(row.source_name ?? 'Unknown')
        bySource.set(row.source_name ?? 'Unknown', {
          sourceType: row.source_type ?? 'Unknown',
          count: (existing?.count ?? 0) + 1,
          lastSynced: existing && existing.lastSynced > row.retrieved_at ? existing.lastSynced : row.retrieved_at,
        })
      }

      return {
        integrations: [...bySource.entries()].map(([sourceName, v]) => ({ sourceName, ...v })),
        rows,
      }
    },
  })
}

export function useDeleteExternalData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (externalDataId: number) => {
      const { error } = await supabase.from('external_data').delete().eq('external_data_id', externalDataId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_integrations'] }),
  })
}
