import { Send } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { sendChatMessage, type AiChatMessage } from '../lib/ai'

const WELCOME: AiChatMessage = {
  role: 'assistant',
  content: "G'day! Ask me anything about the Northern Territory — best time to visit Kakadu, what to pack, where to eat in Darwin, you name it.",
}

export function AIChatbot() {
  const [messages, setMessages] = useState<AiChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, sending])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const history = [...messages, { role: 'user' as const, content: text }]
    setMessages(history)
    setInput('')
    setSending(true)
    const reply = await sendChatMessage(history)
    setMessages([...history, { role: 'assistant', content: reply }])
    setSending(false)
  }

  return (
    <div className="flex flex-col gap-4 px-5 pb-4 pt-14">
      <h1 className="heading text-2xl text-ink">AI Trip Assistant</h1>

      <div className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user' ? 'bg-teal text-white' : 'border border-border-card bg-white text-ink'
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}
        {sending && <p className="text-xs text-muted">Thinking…</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about the Territory…"
          className="flex-1 rounded-2xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-teal"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal disabled:opacity-40"
        >
          <Send size={16} color="white" />
        </button>
      </form>
    </div>
  )
}
