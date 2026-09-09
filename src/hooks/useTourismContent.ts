import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { ContentType } from '../lib/database.types'

interface Filters {
  contentType?: ContentType
  contentTypes?: ContentType[]
  category?: string
  excludeCategory?: string
}

export function useTourismContent(filters: Filters | ContentType = {}) {
  // Allow the old shorthand `useTourismContent('Destination')` alongside `useTourismContent({ category: 'Food' })`.
  const { contentType, contentTypes, category, excludeCategory } =
    typeof filters === 'string' ? { contentType: filters } : filters

  return useQuery({
    queryKey: [
      'tourism_content',
      contentType ?? contentTypes?.join(',') ?? 'all',
      category ?? 'all',
      excludeCategory ?? 'none',
    ],
    queryFn: async () => {
      let query = supabase
        .from('tourism_content')
        .select('*')
        .eq('status', 'Published')
        .order('event_datetime', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (contentType) query = query.eq('content_type', contentType)
      if (contentTypes) query = query.in('content_type', contentTypes)
      if (category) query = query.eq('category', category)
      if (excludeCategory) query = query.neq('category', excludeCategory)

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}
