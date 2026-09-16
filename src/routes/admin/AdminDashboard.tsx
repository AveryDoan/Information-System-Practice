import { AdminLayout } from '../../components/admin/AdminLayout'
import { StatCard } from '../../components/staff/StatCard'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import { useDashboardStats } from '../../hooks/useStaffAnalytics'
import { useAuth } from '../../lib/auth'

export function AdminDashboard() {
  const { profile } = useAuth()
  const stats = useDashboardStats()
  const users = useAdminUsers()

  const roleCounts = { Visitor: 0, 'NTG Staff': 0, Administrator: 0 }
  for (const u of users.data ?? []) roleCounts[u.role] += 1

  return (
    <AdminLayout title={`G'day, ${profile?.full_name?.split(' ')[0] ?? 'Admin'}`}>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total accounts" value={users.data?.length ?? '—'} />
        <StatCard label="NTG Staff" value={roleCounts['NTG Staff']} />
        <StatCard label="Administrators" value={roleCounts.Administrator} />
        <StatCard label="Published content" value={stats.data?.publishedCount ?? '—'} />
        <StatCard label="Pending approval" value={stats.data?.pendingCount ?? '—'} />
        <StatCard label="Trips planned" value={stats.data?.tripCount ?? '—'} />
      </div>
    </AdminLayout>
  )
}
