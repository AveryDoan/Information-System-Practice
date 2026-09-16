import { Link } from 'react-router-dom'
import { StaffLayout } from '../../components/staff/StaffLayout'
import { StatCard } from '../../components/staff/StatCard'
import { useAuth } from '../../lib/auth'
import { useDashboardStats } from '../../hooks/useStaffAnalytics'

export function StaffDashboard() {
  const { profile } = useAuth()
  const stats = useDashboardStats()

  return (
    <StaffLayout title={`G'day, ${profile?.full_name?.split(' ')[0] ?? 'there'}`}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Published content" value={stats.data?.publishedCount ?? '—'} />
        <StatCard label="Pending approval" value={stats.data?.pendingCount ?? '—'} />
        <StatCard label="Registered visitors" value={stats.data?.visitorCount ?? '—'} />
        <StatCard label="Trips planned" value={stats.data?.tripCount ?? '—'} />
        <StatCard label="Items saved" value={stats.data?.savedCount ?? '—'} />
      </div>

      {stats.data && stats.data.pendingCount > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-border-card bg-chip px-5 py-4">
          <p className="text-sm text-ink">
            {stats.data.pendingCount} item{stats.data.pendingCount === 1 ? '' : 's'} waiting for review.
          </p>
          <Link to="/staff/content" className="text-sm font-semibold text-rust">
            Review now →
          </Link>
        </div>
      )}
    </StaffLayout>
  )
}
