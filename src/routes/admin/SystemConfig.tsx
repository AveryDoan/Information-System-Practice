import { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'

// No system-configuration table exists in the data dictionary, so this is a
// UI-only settings panel (local state, not persisted) — a placeholder for
// whatever real config store gets added later, clearly labeled as such.
export function SystemConfig() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowSignups, setAllowSignups] = useState(true)
  const [siteName, setSiteName] = useState('NT Tourism App')

  return (
    <AdminLayout title="System Configuration">
      <p className="mb-4 rounded-xl bg-chip px-4 py-2.5 text-xs text-rust">
        Demo only — these settings aren't persisted to a backend yet.
      </p>

      <div className="flex max-w-lg flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Site name</span>
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </label>

        <label className="flex items-center justify-between rounded-2xl border border-border-card bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Allow new sign-ups</p>
            <p className="text-xs text-muted">Visitors can create accounts via the app.</p>
          </div>
          <input type="checkbox" checked={allowSignups} onChange={(e) => setAllowSignups(e.target.checked)} className="size-5" />
        </label>

        <label className="flex items-center justify-between rounded-2xl border border-border-card bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Maintenance mode</p>
            <p className="text-xs text-muted">Show a maintenance banner to visitors.</p>
          </div>
          <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="size-5" />
        </label>

        <button disabled className="w-fit rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-white opacity-50">
          Save changes
        </button>
      </div>
    </AdminLayout>
  )
}
