import { documentTypes } from '../../data/mockData.js'

export default function DocumentTypeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {documentTypes.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={`focus-ring rounded-xl border p-4 text-left transition ${
            selected === doc.id
              ? 'border-rose-500 bg-rose-50'
              : 'border-ink/10 bg-white hover:border-ink/20'
          }`}
        >
          <p className="text-sm font-medium text-ink">{doc.label}</p>
          <p className="mt-1 text-xs text-ink-soft">{doc.hint}</p>
        </button>
      ))}
    </div>
  )
}
