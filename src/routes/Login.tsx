import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    <div className="flex min-h-full flex-col justify-center gap-6 px-6 py-14">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-2xl font-bold text-ink">Welcome back</p>
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
  )
}
