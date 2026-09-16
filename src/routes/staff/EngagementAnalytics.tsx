import { StaffLayout } from '../../components/staff/StaffLayout'
import { StatCard } from '../../components/staff/StatCard'
import { useEngagementStats } from '../../hooks/useStaffAnalytics'

export function EngagementAnalytics() {
  const stats = useEngagementStats()

  return (
    <StaffLayout title="Visitor Engagement Analytics">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Registered visitors" value={stats.data?.visitorCount ?? '—'} />
        <StatCard label="Trips planned" value={stats.data?.tripCount ?? '—'} />
        <StatCard label="Items saved" value={stats.data?.savedCount ?? '—'} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-card bg-white">
        <div className="border-b border-border-card px-5 py-3">
          <p className="text-sm font-semibold text-ink">Most-saved destinations</p>
        </div>
        <table className="w-full text-left text-sm">
          <tbody>
            {stats.isLoading && (
              <tr>
                <td className="px-5 py-4 text-muted">Loading…</td>
              </tr>
            )}
            {stats.data?.topSaved.length === 0 && (
              <tr>
                <td className="px-5 py-4 text-muted">No saves yet.</td>
              </tr>
            )}
            {stats.data?.topSaved.map((item) => (
              <tr key={item.contentId} className="border-t border-border-card first:border-t-0">
                <td className="px-5 py-3 text-ink">{item.title}</td>
                <td className="px-5 py-3 text-right text-muted">{item.count} save{item.count === 1 ? '' : 's'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  )
}
