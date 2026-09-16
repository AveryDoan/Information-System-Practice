import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { AccountStatus, UserRole } from '../lib/database.types'

/** Every user account — the Admin-only "Manage Users & Access" / "Manage Roles & Permissions" view. */
export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, role, accountStatus }: { userId: number; role?: UserRole; accountStatus?: AccountStatus }) => {
      const payload: { role?: UserRole; account_status?: AccountStatus } = {}
      if (role) payload.role = role
      if (accountStatus) payload.account_status = accountStatus
      const { error } = await supabase.from('users').update(payload).eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_users'] }),
  })
}
