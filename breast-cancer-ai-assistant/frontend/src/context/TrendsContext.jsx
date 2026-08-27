import { createContext, useContext, useState } from 'react'

const TrendsContext = createContext()

export const TrendsProvider = ({ children }) => {
  const [marker, setMarker] = useState('Hemoglobin')
  const [docTypeFilter, setDocTypeFilter] = useState('all')
  const [timelineData, setTimelineData] = useState([])
  const [reports, setReports] = useState([])
  const [selectedReport1, setSelectedReport1] = useState('')
  const [selectedReport2, setSelectedReport2] = useState('')
  const [comparisonData, setComparisonData] = useState(null)
  const [loadingTimeline, setLoadingTimeline] = useState(true)
  const [loadingCompare, setLoadingCompare] = useState(false)
  const [initialized, setInitialized] = useState(false)

  return (
    <TrendsContext.Provider value={{
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
    }}>
      {children}
    </TrendsContext.Provider>
  )
}

export const useTrends = () => useContext(TrendsContext)
