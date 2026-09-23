import type { LucideIcon } from 'lucide-react'
import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export interface DashboardNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface DashboardLayoutProps {
  portalName: string
  portalLabel: string
  nav: DashboardNavItem[]
  loginPath: string
  title: string
  children: ReactNode
}

/** Shared desktop sidebar shell for the Staff and Admin portals. */
export function DashboardLayout({ portalName, portalLabel, nav, loginPath, title, children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate(loginPath)
  }

  return (
    <div className="flex min-h-svh bg-sand">
      <aside className="flex w-64 shrink-0 flex-col justify-between bg-teal px-4 py-6 text-white">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="size-8 shrink-0" />
            <div>
              <p className="text-sm font-bold">{portalName}</p>
              <p className="text-xs text-white/60">{portalLabel}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map(({ to, label, icon: Icon, end }) => (
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
          <h1 className="mb-6 heading text-3xl text-ink">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
