import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import MobileTabBar from './components/layout/MobileTabBar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import ReportInsightsPage from './pages/ReportInsightsPage.jsx'
import TrendsPage from './pages/TrendsPage.jsx'
import AssistantPage from './pages/AssistantPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import TreatmentJourneyPage from './pages/TreatmentJourneyPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-porcelain pb-16 md:pb-0">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/report" element={<ReportInsightsPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/sandbox" element={<TreatmentJourneyPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <MobileTabBar />
    </div>
  )
}
