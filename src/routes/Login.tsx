import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import wordmark from '../assets/wordmark.svg'
import { HERO_PHOTOS } from '../lib/heroPhotos'
import { useAuth } from '../lib/auth'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error)
    else navigate('/')
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Photo hero banner — southaustralia.com/app-style full-bleed photo + brand-tinted scrim */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img src={HERO_PHOTOS.uluru} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-teal/60" />
        <img src={wordmark} alt="Tourism in Northern Territory" className="absolute inset-x-8 bottom-6 h-14 w-auto object-contain object-left" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-8">
        <div className="flex flex-col gap-1 text-center">
          <p className="heading text-3xl text-ink">Welcome back</p>
          <p className="text-sm text-muted">Log in to plan your Northern Territory trip.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
          />
          {error && <p className="text-xs text-rust">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-2xl bg-teal px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-xs text-muted">
          No account?{' '}
          <Link to="/signup" className="font-semibold text-rust">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
