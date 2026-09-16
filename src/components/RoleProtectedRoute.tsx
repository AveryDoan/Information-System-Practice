import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { UserRole } from '../lib/database.types'

export function RoleProtectedRoute({
  roles,
  loginPath,
  children,
}: {
  roles: UserRole[]
  loginPath: string
  children: ReactNode
}) {
  const { session, profile, loading } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to={loginPath} replace />
  if (!profile) return null // profile still loading in from the DB

  if (!roles.includes(profile.role)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-sand px-8 text-center">
        <p className="text-lg font-bold text-ink">Access denied</p>
        <p className="text-sm text-muted">
          Your account ({profile.role}) doesn't have access to this area.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
