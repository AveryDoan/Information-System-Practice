import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import type { ContentType, ContentStatus } from '../lib/database.types'

/** All tourism_content rows regardless of status — the staff-only view (RLS: "staff read all content"). */
export function useStaffContent(contentTypes?: ContentType[]) {
  return useQuery({
    queryKey: ['staff_content', contentTypes?.join(',') ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('tourism_content').select('*').order('updated_at', { ascending: false })
      if (contentTypes) query = query.in('content_type', contentTypes)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export interface ContentFormValues {
  title: string
  content_type: ContentType
  description: string
  location: string
  category: string
  status: ContentStatus
  image_url: string
  event_datetime: string // '' when not applicable
}

export function useSaveContent(contentId?: number) {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ContentFormValues) => {
      const payload = {
        title: values.title,
        content_type: values.content_type,
        description: values.description || null,
        location: values.location || null,
        category: values.category || null,
        status: values.status,
        image_url: values.image_url || null,
        event_datetime: values.event_datetime || null,
        updated_by: profile?.user_id ?? null,
        updated_at: new Date().toISOString(),
      }

      if (contentId) {
        const { data, error } = await supabase.from('tourism_content').update(payload).eq('content_id', contentId).select().single()
        if (error) throw error
        return data
      }
      const { data, error } = await supabase.from('tourism_content').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff_content'] })
      queryClient.invalidateQueries({ queryKey: ['tourism_content'] })
    },
  })
}
