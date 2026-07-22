import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import UploadDropzone from '../components/upload/UploadDropzone.jsx'
import DocumentTypeSelector from '../components/upload/DocumentTypeSelector.jsx'
import Translate from '../components/common/Translate.jsx'

export default function UploadPage() {
  const [docType, setDocType] = useState('mammogram')
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const navigate = useNavigate()

  const handleAnalyze = () => {
    setProcessing(true)
    // In production this posts to POST /api/reports/upload and polls status.
    setTimeout(() => {
      setProcessing(false)
      navigate('/report')
    }, 1600)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-rose-600"><Translate>Step 1 of 3</Translate></p>
      <h1 className="mt-2 font-display text-3xl text-ink"><Translate>Upload a medical document</Translate></h1>
      <p className="mt-2 text-ink-soft">
        <Translate>Everything is encrypted in transit and at rest, and only visible to you.</Translate>
      </p>

      <Card className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-ink"><Translate>What are you uploading?</Translate></h2>
        <DocumentTypeSelector selected={docType} onSelect={setDocType} />
      </Card>

      <Card className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-ink"><Translate>File</Translate></h2>
        <UploadDropzone onFilesSelected={(files) => setFile(files[0])} />
      </Card>

      <button
        onClick={handleAnalyze}
        disabled={!file || processing}
        className="focus-ring mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <Translate>Extracting medical information…</Translate>
          </>
        ) : (
          <Translate>Analyze document</Translate>
        )}
      </button>
    </div>
  )
}
