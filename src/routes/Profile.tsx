import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function Profile() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="size-16 rounded-full bg-gradient-to-br from-amber to-rust" />
        <div>
          <p className="text-lg font-bold text-ink">{profile?.full_name ?? '…'}</p>
          <p className="text-xs text-muted">{profile?.email}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border-card bg-white p-4">
        <p className="text-xs text-muted">Role</p>
        <p className="text-sm font-semibold text-ink">{profile?.role ?? 'Visitor'}</p>
      </div>

      <button
        onClick={handleSignOut}
        className="rounded-2xl border border-border-card bg-white px-4 py-3 text-sm font-semibold text-rust"
      >
        Log out
      </button>
    </div>
  )
}
