import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import TrendChart from '../components/trends/TrendChart.jsx'
import { trendSeries } from '../data/mockData.js'
import Translate from '../components/common/Translate.jsx'

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-rose-600"><Translate>Health trends</Translate></p>
      <h1 className="mt-2 font-display text-3xl text-ink"><Translate>Your timeline, compared</Translate></h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        <Translate>Unlike a single report snapshot, Halcyon compares every new upload against your history so changes are caught early — not just at your next appointment.</Translate>
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft"><Translate>CA 15-3 tumor marker</Translate></p>
              <p className="font-display text-2xl text-ink">27.4 U/mL</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              <TrendingUp size={13} /> <Translate>+9% since May</Translate>
            </span>
          </div>
          <TrendChart data={trendSeries.ca153} unit="U/mL" referenceValue={30} color="#C97B3B" />
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            <AlertTriangle size={12} className="mr-1 inline" />
            <Translate>Still within the normal reference range, but the upward trend is worth mentioning at your next oncology visit.</Translate>
          </p>
        </Card>

        <Card>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft"><Translate>Tumor size (imaging)</Translate></p>
              <p className="font-display text-2xl text-ink">1.8 cm</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-600">
              <TrendingDown size={13} /> <Translate>−22% since Feb</Translate>
            </span>
          </div>
          <TrendChart data={trendSeries.tumorSize} unit="cm" color="#4F7C74" />
          <p className="mt-3 rounded-lg bg-sage-50 p-3 text-xs leading-relaxed text-sage-900">
            <Translate>Tumor size has decreased across your last three scans — consistent with a positive response to treatment.</Translate>
          </p>
        </Card>
      </div>
    </div>
  )
}
