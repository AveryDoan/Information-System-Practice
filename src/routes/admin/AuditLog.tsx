import { AdminLayout } from '../../components/admin/AdminLayout'
import { useAuditLog } from '../../hooks/useAuditLog'

export function AuditLog() {
  const log = useAuditLog()

  return (
    <AdminLayout title="Audit Log & Security Activity">
      <p className="mb-4 text-xs text-muted">
        Assembled from real account/content/trip activity — there's no dedicated audit table in the schema.
      </p>
      <div className="overflow-hidden rounded-2xl border border-border-card bg-white">
        {log.isLoading && <p className="px-5 py-4 text-sm text-muted">Loading…</p>}
        {log.data?.length === 0 && <p className="px-5 py-4 text-sm text-muted">No activity yet.</p>}
        {log.data?.map((event) => (
          <div key={event.id} className="flex items-center justify-between gap-3 border-t border-border-card px-5 py-3 first:border-t-0">
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{event.action}</p>
              <p className="truncate text-xs text-muted">{event.actor}</p>
            </div>
            <p className="shrink-0 text-xs text-muted">{new Date(event.at).toLocaleString('en-AU')}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
