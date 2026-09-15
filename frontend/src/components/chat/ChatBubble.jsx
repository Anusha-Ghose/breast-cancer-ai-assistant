import { ShieldCheck } from 'lucide-react'

export default function ChatBubble({ role, text, grounded }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-ink text-porcelain'
            : 'rounded-bl-sm border border-ink/5 bg-white text-ink'
        }`}
      >
        {text}
        {grounded && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-sage-600">
            <ShieldCheck size={12} />
            Grounded in your uploaded reports
          </div>
        )}
      </div>
    </div>
  )
}
