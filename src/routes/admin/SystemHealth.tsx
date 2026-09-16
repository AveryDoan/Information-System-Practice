import { AdminLayout } from '../../components/admin/AdminLayout'
import { useSystemHealth } from '../../hooks/useSystemHealth'

const DEMO_SERVICES = [
  { name: 'App server', status: 'Operational', detail: '99.98% uptime (30d)' },
  { name: 'CDN / asset delivery', status: 'Operational', detail: '99.99% uptime (30d)' },
  { name: 'Email delivery', status: 'Degraded', detail: 'Rate-limited on free tier' },
]

export function SystemHealth() {
  const health = useSystemHealth()

  return (
    <AdminLayout title="System Health Monitor">
      <div className="rounded-2xl border border-border-card bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Supabase database</p>
            <p className="text-xs text-muted">Live check — real round-trip to your Postgres database</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              health.data?.database.ok ? 'bg-teal/10 text-teal' : 'bg-chip text-rust'
            }`}
          >
            {health.isLoading ? 'Checking…' : health.data?.database.ok ? 'Operational' : 'Unreachable'}
          </span>
        </div>
        {health.data && <p className="mt-2 text-xs text-muted">Response time: {health.data.database.latencyMs}ms</p>}
      </div>

      <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
        Demo data — no real app server/CDN/email infrastructure behind this prototype to monitor
      </p>
      <div className="flex flex-col gap-3">
        {DEMO_SERVICES.map((s) => (
          <div key={s.name} className="flex items-center justify-between rounded-2xl border border-border-card bg-white p-5">
            <div>
              <p className="text-sm font-semibold text-ink">{s.name}</p>
              <p className="text-xs text-muted">{s.detail}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                s.status === 'Operational' ? 'bg-teal/10 text-teal' : 'bg-chip text-rust'
              }`}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
