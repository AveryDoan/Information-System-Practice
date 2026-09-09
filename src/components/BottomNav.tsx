import { Compass, Home, Map, Briefcase, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass, end: false },
  { to: '/itinerary/recommended', label: 'Itinerary', icon: Map, end: false },
  { to: '/trips', label: 'Trips', icon: Briefcase, end: false },
  { to: '/profile', label: 'Profile', icon: User, end: false },
] as const

export function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 flex h-[78px] w-full items-center justify-between border-t border-border-nav bg-white px-7 pb-5 pt-3">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center gap-0.5"
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={2} color={isActive ? '#c1440e' : '#99918c'} />
              <span className={isActive ? 'text-[10px] font-semibold text-rust' : 'text-[10px] font-normal text-nav-muted'}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
