import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: ReactNode
  /** Screens like Login/Signup and the trip wizard steps hide the tab bar. */
  showNav?: boolean
}

/**
 * The Figma frames are all 375x812 (iPhone-sized). On a phone this fills the
 * viewport; on desktop it's centered as a fixed-width "device" column so the
 * layout still matches the design 1:1 instead of stretching full-bleed.
 */
export function AppShell({ children, showNav = true }: AppShellProps) {
  return (
    <div className="flex min-h-svh w-full justify-center bg-[#e9e3d9] sm:py-6">
      <div className="relative min-h-svh w-full max-w-[375px] overflow-hidden bg-sand sm:min-h-[812px] sm:rounded-[32px] sm:shadow-xl">
        <div className={`h-full overflow-y-auto ${showNav ? 'pb-[78px]' : ''}`}>{children}</div>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}
