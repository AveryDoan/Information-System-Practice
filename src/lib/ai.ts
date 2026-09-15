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

// Category keywords the Smart Itinerary Planner matches a free-text "vibe"
// against, standing in for real intent extraction. Categories must match
// tourism_content.category values (see supabase/seed.sql).
const INTEREST_KEYWORDS: Record<string, string[]> = {
  Nature: ['nature', 'waterfall', 'park', 'hike', 'hiking', 'outdoor', 'scenery', 'gorge', 'bush'],
  Culture: ['culture', 'art', 'festival', 'history', 'aboriginal', 'heritage', 'museum'],
  Wildlife: ['wildlife', 'animal', 'animals', 'crocodile', 'crocs', 'bird', 'reptile', 'safari'],
  Food: ['food', 'eat', 'restaurant', 'market', 'cuisine', 'dining', 'hungry'],
  Family: ['family', 'kids', 'children', 'relax', 'relaxing'],
}

/** Naive keyword match from a free-text trip description to our content categories. */
export async function inferInterestsFromPrompt(prompt: string): Promise<string[]> {
  await mockDelay(900) // sell the "thinking" moment — this is instant in reality
  const lower = prompt.toLowerCase()
  const matches = Object.entries(INTEREST_KEYWORDS)
    .filter(([, keywords]) => keywords.some((k) => lower.includes(k)))
    .map(([category]) => category)
  return matches.length ? matches : Object.keys(INTEREST_KEYWORDS)
}

function mockDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
