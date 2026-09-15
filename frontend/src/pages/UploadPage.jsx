import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import UploadDropzone from '../components/upload/UploadDropzone.jsx'
import DocumentTypeSelector from '../components/upload/DocumentTypeSelector.jsx'
import Translate from '../components/common/Translate.jsx'
import { uploadReport } from '../services/api.js'

export default function UploadPage() {
  const [docType, setDocType] = useState('mammogram')
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const navigate = useNavigate()

  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    setProcessing(true)
    setError(null)
    try {
      const res = await uploadReport(file, docType)
      navigate(`/report?id=${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload report. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16">
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

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
          {error}
        </div>
      )}

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
