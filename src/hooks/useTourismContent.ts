import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { ContentType } from '../lib/database.types'

export function useTourismContent(contentType?: ContentType) {
  return useQuery({
    queryKey: ['tourism_content', contentType ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('tourism_content')
        .select('*')
        .eq('status', 'Published')
        .order('event_datetime', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (contentType) {
        query = query.eq('content_type', contentType)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}
