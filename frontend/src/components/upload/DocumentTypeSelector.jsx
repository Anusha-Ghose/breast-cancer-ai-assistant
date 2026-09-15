import { documentTypes } from '../../data/mockData.js'
import Translate from '../common/Translate.jsx'

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
          <p className="text-sm font-medium text-ink"><Translate>{doc.label}</Translate></p>
          <p className="mt-1 text-xs text-ink-soft"><Translate>{doc.hint}</Translate></p>
        </button>
      ))}
    </div>
  )
}
