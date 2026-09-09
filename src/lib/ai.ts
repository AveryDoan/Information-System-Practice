// Mock AI layer for the "Let AI plan your trip" / chatbot / smart itinerary
// features. Swap the implementation of these functions for real calls to an
// LLM (e.g. via a Supabase Edge Function that holds the API key server-side)
// once the rest of the flow is working — nothing else in the app needs to
// change since callers only depend on this interface.

export interface AiChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendChatMessage(history: AiChatMessage[]): Promise<string> {
  const lastUserMessage = [...history].reverse().find((m) => m.role === 'user')?.content ?? ''
  await mockDelay()
  return `(mock AI reply) You said: "${lastUserMessage}". Once this is wired to a real model, I'll answer using live Northern Territory tourism data.`
}

export interface TripBrief {
  who: string
  startDate: string
  endDate: string
  budgetLevel: 'Budget' | 'Comfort' | 'Premium'
  interests: string[]
}

export interface GeneratedItineraryDay {
  day: number
  items: { title: string; time: string; note: string }[]
}

export async function generateItinerary(brief: TripBrief): Promise<GeneratedItineraryDay[]> {
  await mockDelay()
  return [
    {
      day: 1,
      items: [
        { title: 'Arrive in Darwin', time: '10:00 AM', note: `Mock itinerary for ${brief.who}` },
        { title: 'Mindil Beach Sunset Markets', time: '5:00 PM', note: `Matches interest: ${brief.interests[0] ?? 'general'}` },
      ],
    },
  ]
}

function mockDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
