import { useEffect, useMemo } from 'react'
import { TrendingDown, TrendingUp, AlertTriangle, Loader2, Sparkles, ChevronDown, Filter } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import TrendChart from '../components/trends/TrendChart.jsx'
import ComparisonChart from '../components/trends/ComparisonChart.jsx'
import { getTimeline, getReports, compareReports } from '../services/api.js'
import Translate from '../components/common/Translate.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useTrends } from '../context/TrendsContext.jsx'

export default function TrendsPage() {
  const {
    marker, setMarker,
    docTypeFilter, setDocTypeFilter,
    timelineData, setTimelineData,
    reports, setReports,
    selectedReport1, setSelectedReport1,
    selectedReport2, setSelectedReport2,
    comparisonData, setComparisonData,
    loadingTimeline, setLoadingTimeline,
    loadingCompare, setLoadingCompare,
    initialized, setInitialized
  } = useTrends()

  useEffect(() => {
    if (!initialized) {
      getReports().then(res => {
        // Sort newest to oldest so index 0 is newest
        const sorted = res.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
        setReports(sorted)
        setInitialized(true)
      }).catch(console.error)
    }
  }, [initialized, setReports, setInitialized])

  const uniqueDocTypes = useMemo(() => {
    const types = new Set()
    reports.forEach(r => types.add(r.document_type))
    return Array.from(types)
  }, [reports])

  const filteredReports = useMemo(() => {
    if (docTypeFilter === 'all') return reports;
    return reports.filter(r => r.document_type === docTypeFilter)
  }, [reports, docTypeFilter])

  useEffect(() => {
    // When filter changes, update default comparison selections (oldest first, newest second)
    if (filteredReports.length >= 2) {
      setSelectedReport1(filteredReports[1].id) // Older
      setSelectedReport2(filteredReports[0].id) // Newer
    } else {
      setSelectedReport1('')
      setSelectedReport2('')
    }
  }, [filteredReports])

  const uniqueMarkers = useMemo(() => {
    const markers = new Set(['Hemoglobin']) // Always include a default
    filteredReports.forEach(r => {
      r.extracted_entities?.lab_parameters?.forEach(p => {
        if (p.name) markers.add(p.name)
      })
    })
    return Array.from(markers).sort()
  }, [filteredReports])

  // If the currently selected marker isn't in the filtered list, switch to the first available
  useEffect(() => {
    if (!uniqueMarkers.includes(marker)) {
      setMarker(uniqueMarkers[0])
    }
  }, [uniqueMarkers, marker])

  useEffect(() => {
    setLoadingTimeline(true)
    getTimeline(marker, docTypeFilter).then(res => {
      const formatted = res.data.map((item, i) => ({
        visit: `V${i+1}`,
        label: new Date(item.date).toLocaleDateString(),
        value: item.value
      }))
      setTimelineData(formatted)
      setLoadingTimeline(false)
    }).catch(err => {
      console.error(err)
      setLoadingTimeline(false)
    })
  }, [marker, docTypeFilter])

  const { lang } = useLanguage()

  const handleCompare = () => {
    if (!selectedReport1 || !selectedReport2) return;
    setLoadingCompare(true)
    setComparisonData(null)
    compareReports(selectedReport1, selectedReport2, lang).then(res => {
      setComparisonData(res.data)
      setLoadingCompare(false)
    }).catch(err => {
      console.error(err)
      setLoadingCompare(false)
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-rose-600"><Translate>Health trends</Translate></p>
          <h1 className="mt-2 font-display text-3xl text-ink"><Translate>Your timeline, compared</Translate></h1>
        </div>
        
        <div className="relative inline-block">
          <Filter size={14} className="absolute left-3 top-3.5 text-ink-soft pointer-events-none" />
          <select 
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="appearance-none font-display text-sm font-medium text-ink bg-transparent border border-ink/10 hover:border-ink/20 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 pl-9 pr-8 py-2 shadow-sm transition cursor-pointer"
          >
            <option value="all" className="font-sans text-sm">All Documents</option>
            {uniqueDocTypes.map(t => (
              <option key={t} value={t} className="font-sans text-sm">{t.replace('_', ' ')}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-ink-soft pointer-events-none" />
        </div>
      </div>
      
      <p className="mt-4 max-w-xl text-ink-soft">
        <Translate>Halcyon compares every new upload against your history so changes are caught early.</Translate>
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft mb-1"><Translate>Biomarker Timeline</Translate></p>
              <div className="relative inline-block mt-2">
                <select 
                  value={marker} 
                  onChange={(e) => setMarker(e.target.value)}
                  className="appearance-none font-display text-sm font-medium text-ink bg-transparent border border-ink/10 hover:border-ink/20 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 w-64 px-4 py-2 cursor-pointer shadow-sm transition"
                >
                  {uniqueMarkers.map(m => (
                    <option key={m} value={m} className="font-sans text-sm">{m}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-ink-soft pointer-events-none" />
              </div>
            </div>
          </div>
          {loadingTimeline ? (
            <div className="h-56 w-full flex items-center justify-center">
              <Loader2 className="animate-spin text-rose-500" size={24} />
            </div>
          ) : timelineData.length > 0 ? (
            <TrendChart data={timelineData} unit="" color="#C97B3B" />
          ) : (
            <div className="h-56 w-full flex items-center justify-center text-ink-soft text-sm">
              No data points found for this marker in the selected document type.
            </div>
          )}
        </Card>

        <Card className="md:col-span-2 mt-2">
          <div className="mb-4 flex flex-col items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft"><Translate>AI Report Comparison</Translate></p>
              
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative inline-block w-full sm:w-64">
                  <select 
                    value={selectedReport1}
                    onChange={(e) => setSelectedReport1(e.target.value)}
                    className="appearance-none font-display text-sm font-medium text-ink bg-transparent border border-ink/10 hover:border-ink/20 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 w-full pl-4 pr-8 py-2 shadow-sm transition cursor-pointer"
                  >
                    <option value="" disabled className="font-sans text-sm">Select older report...</option>
                    {filteredReports.map(r => (
                      <option key={r.id} value={r.id} className="font-sans text-sm">
                        {new Date(r.extracted_entities?.report_date || r.upload_date).toLocaleDateString()} - {r.document_type.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-ink-soft pointer-events-none" />
                </div>
                
                <span className="text-ink-soft text-sm font-medium">vs</span>
                
                <div className="relative inline-block w-full sm:w-64">
                  <select 
                    value={selectedReport2}
                    onChange={(e) => setSelectedReport2(e.target.value)}
                    className="appearance-none font-display text-sm font-medium text-ink bg-transparent border border-ink/10 hover:border-ink/20 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 w-full pl-4 pr-8 py-2 shadow-sm transition cursor-pointer"
                  >
                    <option value="" disabled className="font-sans text-sm">Select newer report...</option>
                    {filteredReports.map(r => (
                      <option key={r.id} value={r.id} className="font-sans text-sm">
                        {new Date(r.extracted_entities?.report_date || r.upload_date).toLocaleDateString()} - {r.document_type.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-ink-soft pointer-events-none" />
                </div>
                
                <button 
                  onClick={handleCompare} 
                  disabled={!selectedReport1 || !selectedReport2 || selectedReport1 === selectedReport2 || filteredReports.length < 2} 
                  className="px-5 py-2.5 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition disabled:opacity-50 whitespace-nowrap shadow-sm"
                >
                  Compare
                </button>
              </div>
              
              {filteredReports.length < 2 && (
                <p className="text-xs text-rose-500 mt-2">
                  You need at least 2 reports of this document type to run a comparison.
                </p>
              )}
            </div>
          </div>
          
          {loadingCompare && (
             <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-ink-soft">
               <Loader2 className="animate-spin text-rose-500" size={28} />
               Analyzing changes between selected reports...
             </div>
          )}

          {comparisonData && !loadingCompare && (
            <div className="mt-4 border-t border-ink/5 pt-6">
              <ComparisonChart chartData={comparisonData.chart_data} insights={comparisonData.insights} />
              
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                 <div className="flex items-center gap-2 mb-2">
                   <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600"/> AI Summary
                   </p>
                   {comparisonData.confidence_score !== undefined && comparisonData.confidence_score !== null && (
                     <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                       {comparisonData.confidence_score}% <Translate>confidence</Translate>
                     </span>
                   )}
                 </div>
                 <p className="text-sm leading-relaxed text-blue-800/90 whitespace-pre-line">
                   {comparisonData.summary}
                 </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
