import { ShieldCheck, HeartHandshake, History } from 'lucide-react'

export default function ChatBubble({ role, text, grounded, emotion, longitudinal_applied }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-ink text-porcelain shadow-sm'
            : 'rounded-bl-sm border border-ink/10 bg-white text-ink shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>

        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-ink/5 flex items-center justify-between flex-wrap gap-2 text-[11px]">
            {grounded && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck size={12} />
                Grounded in Medical KB
              </span>
            )}
            {emotion && (
              <span className="flex items-center gap-1 text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                <HeartHandshake size={12} />
                Empathy Mode ({emotion})
              </span>
            )}
            {longitudinal_applied !== false && (
              <span className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                <History size={12} />
                Longitudinal History Active
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
