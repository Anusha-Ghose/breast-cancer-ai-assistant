import { useRef, useEffect } from 'react'
import { Send, Database, Loader2 } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import ChatBubble from '../components/chat/ChatBubble.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useAssistant } from '../context/AssistantContext.jsx'
import Translate from '../components/common/Translate.jsx'

const SUGGESTIONS = [
  'What does HER2 negative mean for me?',
  'Explain my Ki-67 result',
  'What should I ask my oncologist next visit?',
]

export default function AssistantPage() {
  const { lang, t } = useLanguage()
  const { messages, input, setInput, isTyping, send } = useAssistant()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = (text) => {
    send(text, lang)
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-rose-600"><Translate>AI assistant</Translate></p>
      <h1 className="mt-2 font-display text-3xl text-ink"><Translate>Ask about your reports</Translate></h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
        <Database size={14} />
        <Translate>Answers are retrieved from your documents and a verified medical knowledge base.</Translate>
      </p>

      <Card className="mt-8" padded={false}>
        <div className="flex max-h-[480px] flex-col gap-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <ChatBubble key={i} {...m} />
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-ink/5 bg-white text-ink px-4 py-3 text-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-rose-500" size={16} />
                <span className="italic text-ink-soft"><Translate>Thinking...</Translate></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-ink/5 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="focus-ring rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-rose-300 hover:text-rose-600"
              >
                <Translate>{s}</Translate>
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('askPlaceholder')}
              className="focus-ring flex-1 rounded-full border border-ink/10 bg-porcelain-dim px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60"
            />
            <button
              type="submit"
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-700"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
