import { useNavigate } from 'react-router-dom'
import { SelectPill } from '../components/SelectPill'
import { WizardStep } from '../components/WizardStep'
import { usePlanTripStore, type BudgetLevel } from '../store/planTrip'

const LEVELS: BudgetLevel[] = ['Budget', 'Comfort', 'Premium']

export function PlanBudget() {
  const { budgetLevel, setBudget } = usePlanTripStore()
  const navigate = useNavigate()

  return (
    <WizardStep step={3} title="What's your budget?" onContinue={() => navigate('/plan/interests')}>
      <div className="flex flex-col gap-3">
        {LEVELS.map((level) => (
          <SelectPill key={level} label={level} selected={budgetLevel === level} onClick={() => setBudget(level)} />
        ))}
      </div>
    </WizardStep>
  )
}
