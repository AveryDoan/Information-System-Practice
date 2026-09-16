import { Trash2 } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useDeleteExternalData, useIntegrations } from '../../hooks/useIntegrations'

export function Integrations() {
  const integrations = useIntegrations()
  const deleteRow = useDeleteExternalData()

  return (
    <AdminLayout title="Third-Party Integrations">
      <div className="grid grid-cols-3 gap-4">
        {integrations.data?.integrations.map((i) => (
          <div key={i.sourceName} className="rounded-2xl border border-border-card bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-ink">{i.sourceName}</p>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal">Connected</span>
            </div>
            <p className="text-xs text-muted">{i.sourceType}</p>
            <p className="mt-3 text-xs text-muted">{i.count} record{i.count === 1 ? '' : 's'} synced</p>
            <p className="text-xs text-muted">Last: {new Date(i.lastSynced).toLocaleString('en-AU')}</p>
          </div>
        ))}
        {integrations.data?.integrations.length === 0 && (
          <p className="col-span-3 text-sm text-muted">No integrations connected yet.</p>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-card bg-white">
        <div className="border-b border-border-card px-5 py-3">
          <p className="text-sm font-semibold text-ink">Recent sync events</p>
        </div>
        {integrations.data?.rows.map((r) => (
          <div key={r.external_data_id} className="flex items-center justify-between gap-3 border-t border-border-card px-5 py-3 first:border-t-0">
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">
                {r.source_name} · {r.contentTitle}
              </p>
              <p className="truncate text-xs text-muted">{r.data_value}</p>
            </div>
            <button
              onClick={() => deleteRow.mutate(r.external_data_id)}
              className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-chip hover:text-rust"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
