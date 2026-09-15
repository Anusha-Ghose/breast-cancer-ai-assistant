const TONES = {
  positive: 'bg-rose-100 text-rose-700',
  negative: 'bg-sage-100 text-sage-600',
  neutral: 'bg-ink/5 text-ink-soft',
  warning: 'bg-amber-100 text-amber-700',
}

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}
