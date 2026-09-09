import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

/** Set of content_ids the signed-in user has already saved — used to skip them in Discover. */
export function useSavedIds() {
  const { profile } = useAuth()
  return useQuery({
    queryKey: ['saved_items', 'ids', profile?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase.from('saved_items').select('content_id').eq('user_id', profile!.user_id)
      if (error) throw error
      return new Set(data.map((d) => d.content_id))
    },
    enabled: Boolean(profile),
  })
}
