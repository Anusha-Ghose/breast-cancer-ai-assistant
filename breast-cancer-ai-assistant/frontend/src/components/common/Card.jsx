export default function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-ink/5 shadow-card ${padded ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
