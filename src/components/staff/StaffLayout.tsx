import { BarChart3, Building2, LayoutDashboard, LogOut, MapPinned, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

const NAV = [
  { to: '/staff', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/staff/content', label: 'Tourism Content', icon: MapPinned, end: false },
  { to: '/staff/providers', label: 'Providers & Partnerships', icon: Building2, end: false },
  { to: '/staff/analytics', label: 'Visitor Engagement', icon: BarChart3, end: false },
  { to: '/staff/recommendations', label: 'Recommendations', icon: Sparkles, end: false },
]

export function StaffLayout({ title, children }: { title: string; children: ReactNode }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/staff/login')
  }

  return (
    <div className="flex min-h-svh bg-sand">
      <aside className="flex w-64 shrink-0 flex-col justify-between bg-teal px-4 py-6 text-white">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-sm font-bold">NT Tourism</p>
            <p className="text-xs text-white/60">Staff Portal</p>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="truncate text-sm font-semibold">{profile?.full_name}</p>
            <p className="text-xs text-white/60">{profile?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">
          <h1 className="mb-6 text-2xl font-bold text-ink">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
