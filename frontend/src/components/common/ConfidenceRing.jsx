export default function ConfidenceRing({ value, size = 56 }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const tone =
    value >= 90 ? 'stroke-sage-500' : value >= 75 ? 'stroke-amber-500' : 'stroke-rose-500'
  const textTone =
    value >= 90 ? 'text-sage-600' : value >= 75 ? 'text-amber-700' : 'text-rose-600'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="4"
          className="stroke-ink/10 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="4"
          strokeLinecap="round"
          className={`fill-none transition-all duration-700 ${tone}`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute text-xs font-semibold ${textTone}`}>{value}%</span>
    </div>
  )
}
