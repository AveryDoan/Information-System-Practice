import { useNavigate } from 'react-router-dom'
import { SelectPill } from '../components/SelectPill'
import { WizardStep } from '../components/WizardStep'
import { usePlanTripStore } from '../store/planTrip'

const OPTIONS = ['Solo', 'Couple', 'Family', 'Friends']

export function PlanWho() {
  const { who, setWho } = usePlanTripStore()
  const navigate = useNavigate()

  return (
    <WizardStep step={1} title="Who's going?" onContinue={() => navigate('/plan/dates')} continueDisabled={!who}>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <SelectPill key={opt} label={opt} selected={who === opt} onClick={() => setWho(opt)} />
        ))}
      </div>
    </WizardStep>
  )
}
