import { Activity, LayoutDashboard, Plug, ScrollText, Settings, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { DashboardLayout, type DashboardNavItem } from '../dashboard/DashboardLayout'

const NAV: DashboardNavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users & Roles', icon: Users },
  { to: '/admin/integrations', label: 'Integrations', icon: Plug },
  { to: '/admin/health', label: 'System Health', icon: Activity },
  { to: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  { to: '/admin/config', label: 'System Configuration', icon: Settings },
]

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DashboardLayout portalName="NT Tourism" portalLabel="System Admin" nav={NAV} loginPath="/admin/login" title={title}>
      {children}
    </DashboardLayout>
  )
}
