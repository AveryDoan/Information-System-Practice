import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface WizardStepProps {
  step: number
  totalSteps?: number
  title: string
  subtitle?: string
  children: ReactNode
  onContinue: () => void
  continueDisabled?: boolean
  continueLabel?: string
  submitting?: boolean
}

export function WizardStep({
  step,
  totalSteps = 4,
  title,
  subtitle,
  children,
  onContinue,
  continueDisabled,
  continueLabel = 'Continue',
  submitting,
}: WizardStepProps) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-full flex-col gap-6 px-6 pb-8 pt-14">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex size-9 items-center justify-center rounded-full bg-white">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-rust' : 'bg-border-card'}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>

      <div className="flex-1">{children}</div>

      <button
        onClick={onContinue}
        disabled={continueDisabled || submitting}
        className="rounded-2xl bg-teal px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
      >
        {submitting ? 'Creating your trip…' : continueLabel}
      </button>
    </div>
  )
}
