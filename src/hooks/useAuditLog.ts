import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

interface AuditEvent {
  id: string
  at: string
  actor: string
  action: string
}

/**
 * There's no dedicated audit-log table in the data dictionary, so this
 * synthesizes a real activity feed from timestamps/actors that already exist:
 * new signups, content edits (tourism_content.updated_by), and trips created.
 * Real events, not mocked — just assembled from existing tables.
 */
export function useAuditLog() {
  return useQuery({
    queryKey: ['admin_audit_log'],
    queryFn: async () => {
      const [{ data: users }, { data: content }, { data: trips }] = await Promise.all([
        supabase.from('users').select('user_id, full_name, email, created_at').order('created_at', { ascending: false }).limit(20),
        supabase
          .from('tourism_content')
          .select('content_id, title, status, updated_by, updated_at')
          .order('updated_at', { ascending: false })
          .limit(20),
        supabase.from('trips').select('trip_id, trip_name, user_id, created_at').order('created_at', { ascending: false }).limit(20),
      ])

      const userIds = [...new Set((content ?? []).map((c) => c.updated_by).filter((id): id is number => id !== null))]
      const editors = userIds.length
        ? (await supabase.from('users').select('user_id, full_name').in('user_id', userIds)).data ?? []
        : []

      const tripUserIds = [...new Set((trips ?? []).map((t) => t.user_id))]
      const tripOwners = tripUserIds.length
        ? (await supabase.from('users').select('user_id, full_name').in('user_id', tripUserIds)).data ?? []
        : []

      const events: AuditEvent[] = [
        ...(users ?? []).map((u) => ({
          id: `signup-${u.user_id}`,
          at: u.created_at,
          actor: u.full_name,
          action: `Account created (${u.email})`,
        })),
        ...(content ?? []).map((c) => ({
          id: `content-${c.content_id}-${c.updated_at}`,
          at: c.updated_at,
          actor: editors.find((e) => e.user_id === c.updated_by)?.full_name ?? 'System',
          action: `Updated "${c.title}" → ${c.status}`,
        })),
        ...(trips ?? []).map((t) => ({
          id: `trip-${t.trip_id}`,
          at: t.created_at,
          actor: tripOwners.find((o) => o.user_id === t.user_id)?.full_name ?? 'Unknown',
          action: `Planned trip "${t.trip_name}"`,
        })),
      ]

      return events.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 30)
    },
  })
}
