import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { HERO_PHOTOS } from '../lib/heroPhotos'

export function Profile() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-32 shrink-0 overflow-hidden">
        <img src={HERO_PHOTOS.litchfield} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-teal/45" />
      </div>

      <div className="flex flex-col gap-6 px-5 pb-6">
        <div className="-mt-10 flex flex-col items-center gap-3 text-center">
          <div className="size-20 rounded-full border-4 border-sand bg-gradient-to-br from-amber to-rust" />
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
    </div>
  )
}
