import { ManageContent } from './ManageContent'

// Simplification: the data dictionary has no separate PROVIDER entity, so
// "Providers & Partnerships" is the same tourism_content table, filtered to
// the business-listing content types.
export function ManageProviders() {
  return (
    <ManageContent
      title="Manage Providers & Partnerships"
      contentTypes={['Accommodation', 'Tour']}
      newPath="/staff/providers/new"
      editPathFor={(id) => `/staff/providers/${id}/edit`}
    />
  )
}
