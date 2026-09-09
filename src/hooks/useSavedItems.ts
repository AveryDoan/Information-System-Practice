import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

export function useIsSaved(contentId: number) {
  const { profile } = useAuth()
  return useQuery({
    queryKey: ['saved_items', profile?.user_id, contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_items')
        .select('saved_item_id')
        .eq('user_id', profile!.user_id)
        .eq('content_id', contentId)
        .maybeSingle()
      if (error) throw error
      return Boolean(data)
    },
    enabled: Boolean(profile),
  })
}

export function useToggleSaved(contentId: number) {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const isSaved = useIsSaved(contentId)

  return useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error('Must be logged in to save items')
      if (isSaved.data) {
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', profile.user_id)
          .eq('content_id', contentId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('saved_items').insert({ user_id: profile.user_id, content_id: contentId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved_items', profile?.user_id, contentId] })
    },
  })
}
