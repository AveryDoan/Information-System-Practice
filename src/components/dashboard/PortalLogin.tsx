import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import wordmark from '../../assets/wordmark.svg'
import { useAuth } from '../../lib/auth'

interface PortalLoginProps {
  heading: string
  subheading: string
  redirectTo: string
  /** Full-bleed background photo behind the card — see src/lib/heroPhotos.ts */
  photo: string
}

export function PortalLogin({ heading, subheading, redirectTo, photo }: PortalLoginProps) {
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
    else navigate(redirectTo)
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center px-6">
      <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-teal/75" />

      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <img src={wordmark} alt="Tourism in Northern Territory" className="mb-2 h-14 w-auto object-contain" />
          <p className="heading text-2xl text-ink">{heading}</p>
          <p className="text-sm text-muted">{subheading}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-teal"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-teal"
          />
          {error && <p className="text-xs text-rust">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
