import Translate from '../common/Translate.jsx'

const LEVELS = [
  { score: 0, label: 'Incomplete' },
  { score: 1, label: 'Negative' },
  { score: 2, label: 'Benign' },
  { score: 3, label: 'Probably benign' },
  { score: 4, label: 'Suspicious' },
  { score: 5, label: 'Highly suggestive' },
  { score: 6, label: 'Known malignancy' },
]

export default function BIRADSGauge({ score }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            <Translate>BI-RADS category</Translate>
          </p>
          <p className="font-display text-4xl text-ink">
            {score}
            <span className="ml-2 text-lg font-sans font-medium text-rose-600">
              <Translate>{LEVELS[score]?.label}</Translate>
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-1">
        {LEVELS.map((level) => (
          <div
            key={level.score}
            className={`h-2 flex-1 rounded-full ${
              level.score <= score ? 'bg-rose-500' : 'bg-ink/10'
            } ${level.score === score ? 'ring-2 ring-rose-300 ring-offset-2 ring-offset-white' : ''}`}
            title={level.label}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-ink-soft">
        <span>0 · <Translate>Incomplete</Translate></span>
        <span>6 · <Translate>Malignancy</Translate></span>
      </div>
    </div>
  )
}
