import { BarChart3, Building2, LayoutDashboard, MapPinned, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { DashboardLayout, type DashboardNavItem } from '../dashboard/DashboardLayout'

const NAV: DashboardNavItem[] = [
  { to: '/staff', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/staff/content', label: 'Tourism Content', icon: MapPinned },
  { to: '/staff/providers', label: 'Providers & Partnerships', icon: Building2 },
  { to: '/staff/analytics', label: 'Visitor Engagement', icon: BarChart3 },
  { to: '/staff/recommendations', label: 'Recommendations', icon: Sparkles },
]

export function StaffLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DashboardLayout portalName="NT Tourism" portalLabel="Staff Portal" nav={NAV} loginPath="/staff/login" title={title}>
      {children}
    </DashboardLayout>
  )
}
