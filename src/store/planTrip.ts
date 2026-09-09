import { create } from 'zustand'

export type BudgetLevel = 'Budget' | 'Comfort' | 'Premium'

interface PlanTripState {
  who: string
  startDate: string
  endDate: string
  budgetLevel: BudgetLevel
  interests: string[]
  setWho: (who: string) => void
  setDates: (startDate: string, endDate: string) => void
  setBudget: (level: BudgetLevel) => void
  toggleInterest: (interest: string) => void
  reset: () => void
}

const initial = {
  who: '',
  startDate: '',
  endDate: '',
  budgetLevel: 'Comfort' as BudgetLevel,
  interests: [] as string[],
}

/** Draft state for the Plan Trip wizard (steps 06-09), cleared once the trip is created. */
export const usePlanTripStore = create<PlanTripState>((set) => ({
  ...initial,
  setWho: (who) => set({ who }),
  setDates: (startDate, endDate) => set({ startDate, endDate }),
  setBudget: (budgetLevel) => set({ budgetLevel }),
  toggleInterest: (interest) =>
    set((s) => ({
      interests: s.interests.includes(interest) ? s.interests.filter((i) => i !== interest) : [...s.interests, interest],
    })),
  reset: () => set(initial),
}))
