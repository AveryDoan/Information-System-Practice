import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useContentById(contentId: number) {
  return useQuery({
    queryKey: ['tourism_content', 'byId', contentId],
    queryFn: async () => {
      const { data, error } = await supabase.from('tourism_content').select('*').eq('content_id', contentId).single()
      if (error) throw error
      return data
    },
    enabled: Number.isFinite(contentId),
  })
}