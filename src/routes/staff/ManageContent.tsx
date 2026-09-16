import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StaffLayout } from '../../components/staff/StaffLayout'
import { useStaffContent } from '../../hooks/useStaffContent'
import type { ContentStatus, ContentType } from '../../lib/database.types'

const STATUS_STYLES: Record<ContentStatus, string> = {
  Draft: 'bg-border-card text-muted',
  'Pending Approval': 'bg-chip text-rust',
  Published: 'bg-teal/10 text-teal',
  Archived: 'bg-border-card text-muted',
  Inactive: 'bg-border-card text-muted',
}

interface ManageContentProps {
  title: string
  /** Restricts the list to these content_types — used for the Providers & Partnerships view. */
  contentTypes?: ContentType[]
  newPath: string
  editPathFor: (id: number) => string
}

export function ManageContent({ title, contentTypes, newPath, editPathFor }: ManageContentProps) {
  const content = useStaffContent(contentTypes)
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'All'>('All')

  const rows = content.data?.filter((c) => statusFilter === 'All' || c.status === statusFilter) ?? []

  return (
    <StaffLayout title={title}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'All')}
          className="rounded-lg border border-border-card bg-white px-3 py-2 text-sm text-ink"
        >
          {(['All', 'Draft', 'Pending Approval', 'Published', 'Archived', 'Inactive'] as const).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Link
          to={newPath}
          className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-card bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {content.isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!content.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.content_id} className="border-t border-border-card last:border-b-0">
                <td className="px-4 py-3">
                  <Link to={editPathFor(row.content_id)} className="font-medium text-ink hover:text-rust">
                    {row.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{row.content_type}</td>
                <td className="px-4 py-3 text-muted">{row.category ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{new Date(row.updated_at).toLocaleDateString('en-AU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  )
}
