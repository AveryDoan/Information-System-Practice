import { AdminLayout } from '../../components/admin/AdminLayout'
import { useAdminUsers, useUpdateUser } from '../../hooks/useAdminUsers'
import { useAuth } from '../../lib/auth'
import type { AccountStatus, UserRole } from '../../lib/database.types'

const ROLES: UserRole[] = ['Visitor', 'NTG Staff', 'Administrator']
const STATUSES: AccountStatus[] = ['Active', 'Inactive', 'Suspended', 'Pending']

// Combines the Figma's "Manage Users & Access" and "Manage Roles &
// Permissions" screens: the data dictionary has no separate permissions
// table, so editing a user's `role` here *is* the permissions model.
export function ManageUsers() {
  const { profile: currentProfile } = useAuth()
  const users = useAdminUsers()
  const updateUser = useUpdateUser()

  return (
    <AdminLayout title="Manage Users & Roles">
      <div className="overflow-hidden rounded-2xl border border-border-card bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {users.data?.map((u) => (
              <tr key={u.user_id} className="border-t border-border-card last:border-b-0">
                <td className="px-4 py-3 font-medium text-ink">{u.full_name}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={u.user_id === currentProfile?.user_id}
                    onChange={(e) => updateUser.mutate({ userId: u.user_id, role: e.target.value as UserRole })}
                    className="rounded-lg border border-border-card bg-white px-2 py-1 text-sm disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.account_status}
                    disabled={u.user_id === currentProfile?.user_id}
                    onChange={(e) => updateUser.mutate({ userId: u.user_id, accountStatus: e.target.value as AccountStatus })}
                    className="rounded-lg border border-border-card bg-white px-2 py-1 text-sm disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">You can't change your own role or status here, to avoid locking yourself out.</p>
    </AdminLayout>
  )
}
