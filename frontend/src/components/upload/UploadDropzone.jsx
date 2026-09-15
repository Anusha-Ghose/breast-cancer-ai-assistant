import { useState, useRef } from 'react'
import { UploadCloud, FileCheck2 } from 'lucide-react'
import Translate from '../common/Translate.jsx'

export default function UploadDropzone({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    if (!files?.length) return
    setFileName(files[0].name)
    onFilesSelected?.(files)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragging ? 'border-rose-500 bg-rose-50' : 'border-ink/15 bg-white hover:border-rose-300'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {fileName ? (
        <>
          <FileCheck2 className="mb-3 text-sage-500" size={32} />
          <p className="text-sm font-medium text-ink">{fileName}</p>
          <p className="mt-1 text-xs text-ink-soft">
            <Translate>Ready to analyze</Translate>
          </p>
        </>
      ) : (
        <>
          <UploadCloud className="mb-3 text-ink-soft" size={32} />
          <p className="text-sm font-medium text-ink">
            <Translate>Drag a file here, or click to browse</Translate>
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            <Translate>PDF, JPG, or PNG — up to 20MB</Translate>
          </p>
        </>
      )}
    </div>
  )
}
