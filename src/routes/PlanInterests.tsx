import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SelectPill } from '../components/SelectPill'
import { WizardStep } from '../components/WizardStep'
import { useCreateTrip } from '../hooks/useTrips'
import { usePlanTripStore } from '../store/planTrip'

const INTERESTS = ['Nature', 'Culture', 'Wildlife', 'Food', 'Family']

export function PlanInterests() {
  const { startDate, endDate, budgetLevel, interests, toggleInterest, reset } = usePlanTripStore()
  const createTrip = useCreateTrip()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleContinue() {
    setError(null)
    try {
      const trip = await createTrip.mutateAsync({ startDate, endDate, budgetLevel, interests })
      reset()
      navigate(`/trip/${trip.trip_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your trip.')
    }
  }

  return (
    <WizardStep
      step={4}
      title="What are you into?"
      subtitle="Pick as many as you like — we'll match destinations and events to these."
      onContinue={handleContinue}
      continueLabel="Create my trip"
      submitting={createTrip.isPending}
    >
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => (
          <div key={interest} className="w-[calc(50%-4px)]">
            <SelectPill label={interest} selected={interests.includes(interest)} onClick={() => toggleInterest(interest)} />
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-xs text-rust">{error}</p>}
    </WizardStep>
  )
}
