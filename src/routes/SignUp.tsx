import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import wordmark from '../assets/wordmark.svg'
import { HERO_PHOTOS } from '../lib/heroPhotos'
import { useAuth } from '../lib/auth'

export function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signUp(email, password, fullName)
    setSubmitting(false)
    if (error) setError(error)
    else navigate('/')
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img src={HERO_PHOTOS.kakadu} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-teal/60" />
        <img src={wordmark} alt="Tourism in Northern Territory" className="absolute inset-x-8 bottom-6 h-14 w-auto object-contain object-left" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-8">
        <div className="flex flex-col gap-1 text-center">
          <p className="heading text-3xl text-ink">Create your account</p>
          <p className="text-sm text-muted">Save trips, get recommendations, plan with AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
          />
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
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
          />
          {error && <p className="text-xs text-rust">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-2xl bg-amber px-4 py-3 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-rust">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
