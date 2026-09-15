import ConfidenceRing from '../common/ConfidenceRing.jsx'
import Badge from '../common/Badge.jsx'
import Translate from '../common/Translate.jsx'

const toneFor = (status) => {
  if (status === 'Positive') return 'positive'
  if (status === 'Negative') return 'negative'
  return 'warning'
}

export default function BiomarkerCard({ name, status, value, confidence }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink/5 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-ink"><Translate>{name}</Translate></p>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge tone={toneFor(status)}><Translate>{status}</Translate></Badge>
          <span className="text-xs text-ink-soft"><Translate>{value}</Translate></span>
        </div>
      </div>
      <ConfidenceRing value={confidence} size={48} />
    </div>
  )
}
