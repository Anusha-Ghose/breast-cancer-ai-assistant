import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, FileText, ChevronRight, Loader2, Calendar, Trash2 } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import Badge from '../components/common/Badge.jsx'
import Translate from '../components/common/Translate.jsx'
import api, { getReports, deleteReport } from '../services/api.js'

export default function HistoryPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports()
        // Sort by upload_date descending (newest first)
        const sorted = res.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
        setReports(sorted)
      } catch (err) {
        console.error("Failed to load reports history", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const handleViewPdf = async (e, report) => {
    e.stopPropagation();
    try {
      const response = await api.get(`/reports/${report.id}/view`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch(err) {
      console.error(err);
      alert('Failed to load PDF');
    }
  }

  const handleDelete = async (e, reportId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
    
    setDeletingId(reportId)
    try {
      await deleteReport(reportId)
      setReports(reports.filter(r => r.id !== reportId))
    } catch(err) {
      console.error(err)
      alert("Failed to delete report")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-rose-600 flex items-center gap-2">
          <Clock size={16} /> <Translate>Your Activity</Translate>
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">
          <Translate>Report History</Translate>
        </h1>
        <p className="mt-2 text-ink-soft max-w-xl">
          <Translate>Access and manage all of your previously uploaded medical documents.</Translate>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-rose-500" size={32} />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24 border border-ink/5 rounded-2xl bg-white shadow-sm">
          <FileText size={48} className="mx-auto text-ink/20 mb-4" />
          <p className="text-lg font-medium text-ink"><Translate>No reports found</Translate></p>
          <p className="text-ink-soft mt-1 mb-6"><Translate>You haven't uploaded any medical documents yet.</Translate></p>
          <button onClick={() => navigate('/upload')} className="bg-rose-500 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-rose-600 transition shadow-sm">
            <Translate>Upload your first report</Translate>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div 
              key={report.id}
              onClick={() => navigate(`/report?id=${report.id}`)}
              className={`bg-white border border-ink/10 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-rose-300 hover:shadow-md transition group ${deletingId === report.id ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-lg capitalize flex items-center gap-3">
                    <Translate>{report.document_type.replace('_', ' ')}</Translate>
                    <Badge tone={report.status === 'completed' ? 'success' : 'neutral'}>
                      {report.status}
                    </Badge>
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-ink-soft">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(report.extracted_entities?.report_date || report.upload_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    {report.extracted_entities?.hospital && (
                      <span className="hidden sm:inline-block border-l border-ink/10 pl-4">
                        {report.extracted_entities.hospital}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => handleViewPdf(e, report)}
                  className="hidden sm:block text-xs font-medium bg-porcelain border border-ink/10 px-3 py-1.5 rounded-full text-ink hover:bg-ink/5 transition"
                >
                  <Translate>View PDF</Translate>
                </button>
                <button 
                  onClick={(e) => handleDelete(e, report.id)}
                  disabled={deletingId === report.id}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-ink-soft hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Report"
                >
                  {deletingId === report.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
                <ChevronRight size={20} className="text-ink-soft group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
