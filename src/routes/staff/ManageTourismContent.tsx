import { ManageContent } from './ManageContent'

export function ManageTourismContent() {
  return (
    <ManageContent
      title="Manage Tourism Content"
      newPath="/staff/content/new"
      editPathFor={(id) => `/staff/content/${id}/edit`}
    />
  )
}
