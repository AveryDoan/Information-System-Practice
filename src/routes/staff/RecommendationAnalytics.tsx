import { Trash2 } from 'lucide-react'
import { StaffLayout } from '../../components/staff/StaffLayout'
import { StatCard } from '../../components/staff/StatCard'
import { useDeleteRecommendation, useRecommendationStats } from '../../hooks/useStaffAnalytics'

// Combines the Figma's "Recommendation Analytics & Trends" and "Update
// Recommendation Data" screens: the same table serves both viewing trends
// and correcting/removing individual recommendations.
export function RecommendationAnalytics() {
  const stats = useRecommendationStats()
  const deleteRec = useDeleteRecommendation()

  return (
    <StaffLayout title="Recommendation Analytics & Trends">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Recommendations generated" value={stats.data?.totalCount ?? '—'} />
        <StatCard label="Average relevance score" value={stats.data ? stats.data.avgScore.toFixed(2) : '—'} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-2xl border border-border-card bg-white">
          <div className="border-b border-border-card px-5 py-3">
            <p className="text-sm font-semibold text-ink">By category</p>
          </div>
          <div className="flex flex-col gap-2 p-5">
            {stats.data?.byCategory.map(([category, n]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span className="text-ink">{category}</span>
                <span className="text-muted">{n}</span>
              </div>
            ))}
            {stats.data?.byCategory.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border-card bg-white">
          <div className="border-b border-border-card px-5 py-3">
            <p className="text-sm font-semibold text-ink">Recent recommendations</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {stats.data?.rows.map((r) => (
              <div key={r.recommendation_id} className="flex items-center justify-between gap-3 border-t border-border-card px-5 py-3 first:border-t-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{r.content?.title ?? 'Unknown content'}</p>
                  <p className="truncate text-xs text-muted">{r.recommendation_reason}</p>
                </div>
                <button
                  onClick={() => deleteRec.mutate(r.recommendation_id)}
                  className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-chip hover:text-rust"
                  title="Remove this recommendation"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {stats.data?.rows.length === 0 && <p className="px-5 py-4 text-sm text-muted">No recommendations generated yet.</p>}
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}
