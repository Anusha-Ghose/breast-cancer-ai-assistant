import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileText, Ruler, ListTree, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import Badge from '../components/common/Badge.jsx'
import { getReport } from '../services/api.js'
import Translate from '../components/common/Translate.jsx'

export default function ReportInsightsPage() {
  const [searchParams] = useSearchParams()
  const reportId = searchParams.get('id')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let interval;
    const fetchReport = async () => {
      try {
        let currentId = reportId;
        // If no ID in URL, fetch the latest report
        if (!currentId) {
          const { getReports } = await import('../services/api.js');
          const allRes = await getReports();
          if (allRes.data && allRes.data.length > 0) {
            currentId = allRes.data[0].id;
            // Optionally update the URL so a refresh keeps it
            window.history.replaceState({}, '', `/report?id=${currentId}`);
          } else {
            setError("No reports uploaded yet.");
            setLoading(false);
            return;
          }
        }

        const res = await getReport(currentId)
        const data = res.data
        if (data.status === 'processing') {
          return;
        }
        setReport(data)
        setLoading(false)
        clearInterval(interval)
      } catch (err) {
        console.error(err)
        setError("Failed to load report")
        setLoading(false)
        clearInterval(interval)
      }
    }

    fetchReport()
    interval = setInterval(fetchReport, 2000)

    return () => clearInterval(interval)
  }, [reportId])

  const handleViewPdf = async () => {
    try {
      const { default: api } = await import('../services/api.js');
      const response = await api.get(`/reports/${report.id}/view`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch(err) {
      console.error(err);
      alert('Failed to load PDF');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={32} />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500 gap-2">
        <AlertCircle size={24} /> {error || "Report not found"}
      </div>
    )
  }

  const entities = report.extracted_entities || {}
  const medicines = entities.medicines || []
  const labs = entities.lab_parameters || []

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-rose-600">
            <Translate>Report insights</Translate>
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink capitalize"><Translate>{report.document_type.replace('_', ' ')}</Translate></h1>
          <p className="mt-1 text-sm text-ink-soft">
            {entities.patient_name || 'Unknown Patient'} · <Translate>Reviewed</Translate> {entities.report_date || new Date(report.upload_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={report.status === 'completed' ? 'success' : 'neutral'}>
            <FileText size={12} className="mr-1 inline" />
            {report.status}
          </Badge>
          <button 
            onClick={handleViewPdf}
            className="text-xs font-medium bg-white border border-ink/10 px-3 py-1.5 rounded-full text-ink hover:bg-porcelain transition shadow-sm"
          >
            <Translate>View Original</Translate>
          </button>
        </div>
      </div>

      {(entities.diagnosis?.length > 0 || entities.symptoms?.length > 0) && (
        <Card className="mt-8 border-rose-200 bg-rose-50/60">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 text-rose-600" size={20} />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-rose-900"><Translate>Clinical Summary</Translate></p>
                {entities.summary_confidence_score !== undefined && entities.summary_confidence_score !== null && (
                  <span className="text-xs font-medium text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    {entities.summary_confidence_score}% <Translate>confidence</Translate>
                  </span>
                )}
              </div>
              {entities.diagnosis?.length > 0 && (
                <p className="mt-2 text-sm leading-relaxed text-rose-900/90 font-medium">
                  Diagnosis: {entities.diagnosis.join(', ')}
                </p>
              )}
              {entities.symptoms?.length > 0 && (
                <p className="mt-1 text-sm leading-relaxed text-rose-900/90">
                  Symptoms: {entities.symptoms.join(', ')}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {entities.complex_terminologies?.length > 0 && (
        <Card className="mt-6 border-blue-200 bg-blue-50/60">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900"><Translate>Terminologies Explained</Translate></p>
              <div className="mt-3 space-y-3">
                {entities.complex_terminologies.map((item, idx) => (
                  <div key={idx} className="bg-white/60 p-3 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-blue-900 text-sm">{item.term}</p>
                      {item.confidence_score !== undefined && item.confidence_score !== null && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          {item.confidence_score}% <Translate>confidence</Translate>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-800/80 mt-1">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <Ruler size={14} /> <Translate>Patient Demographics</Translate>
          </p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft"><Translate>Name</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{entities.patient_name || '-'}</Translate></dd>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft"><Translate>Age</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{entities.patient_age || '-'}</Translate></dd>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft"><Translate>Gender</Translate></dt>
              <dd className="font-medium text-ink capitalize"><Translate>{entities.patient_gender || '-'}</Translate></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft"><Translate>Hospital / Doctor</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{entities.hospital || entities.doctor_name || '-'}</Translate></dd>
            </div>
          </dl>
        </Card>

        {entities.doctor_recommendations?.length > 0 && (
          <Card>
            <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
              <ListTree size={14} /> <Translate>Recommendations</Translate>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-ink/80">
              {entities.doctor_recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {labs.length > 0 && (
        <Card className="mt-6">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <ListTree size={14} /> <Translate>Lab Parameters</Translate>
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {labs.map((lab, i) => (
              <div key={i} className={`p-4 rounded-xl border ${lab.is_abnormal ? 'border-rose-200 bg-rose-50/30' : 'border-ink/5 bg-porcelain/30'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-ink text-sm">{lab.name}</span>
                  <div className="flex gap-1.5 items-center">
                    {lab.confidence_score !== undefined && lab.confidence_score !== null && (
                      <span className="text-[10px] font-medium text-ink-soft bg-ink/5 px-2 py-0.5 rounded-full">
                        {lab.confidence_score}%
                      </span>
                    )}
                    {lab.is_abnormal && <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Abnormal</span>}
                  </div>
                </div>
                <div className="text-xl font-display text-ink mt-2">
                  {lab.value} <span className="text-sm text-ink-soft ml-1">{lab.units}</span>
                </div>
                {lab.reference_range && (
                  <div className="text-xs text-ink-soft mt-1">Ref: {lab.reference_range}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {medicines.length > 0 && (
        <Card className="mt-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <Translate>Extracted medications</Translate>
          </p>
          <div className="space-y-3">
            {medicines.map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-ink/5 p-4">
                <div>
                  <p className="text-sm font-medium text-ink"><Translate>{m.name}</Translate></p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    <Translate>{[m.dosage, m.frequency, m.duration].filter(Boolean).join(' • ')}</Translate>
                  </p>
                </div>
                {m.confidence_score !== undefined && m.confidence_score !== null && (
                  <div className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                    {m.confidence_score}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
