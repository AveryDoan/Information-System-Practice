import { useNavigate } from 'react-router-dom'
import { WizardStep } from '../components/WizardStep'
import { usePlanTripStore } from '../store/planTrip'

export function PlanDates() {
  const { startDate, endDate, setDates } = usePlanTripStore()
  const navigate = useNavigate()

  return (
    <WizardStep
      step={2}
      title="When are you going?"
      onContinue={() => navigate('/plan/budget')}
      continueDisabled={!startDate || !endDate || endDate < startDate}
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setDates(e.target.value, endDate)}
            className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          End date
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setDates(startDate, e.target.value)}
            className="rounded-2xl border border-border-soft bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
          />
        </label>
      </div>
    </WizardStep>
  )
}
