import { FileText, Ruler, ListTree, Sparkles } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import Badge from '../components/common/Badge.jsx'
import BIRADSGauge from '../components/report/BIRADSGauge.jsx'
import BiomarkerCard from '../components/report/BiomarkerCard.jsx'
import ConfidenceRing from '../components/common/ConfidenceRing.jsx'
import { latestReport, patient } from '../data/mockData.js'
import Translate from '../components/common/Translate.jsx'

export default function ReportInsightsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-rose-600">
            <Translate>Report insights</Translate>
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink"><Translate>{latestReport.type}</Translate></h1>
          <p className="mt-1 text-sm text-ink-soft">
            {patient.name} · <Translate>Reviewed</Translate> {latestReport.date}
          </p>
        </div>
        <Badge tone="neutral">
          <FileText size={12} className="mr-1 inline" />
          {latestReport.id}
        </Badge>
      </div>

      <Card className="mt-8 border-rose-200 bg-rose-50/60">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 text-rose-600" size={20} />
          <div>
            <p className="text-sm font-medium text-rose-900"><Translate>In plain language</Translate></p>
            <p className="mt-1 text-sm leading-relaxed text-rose-900/90">
              <Translate>{latestReport.summary}</Translate>
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <BIRADSGauge score={latestReport.biRads} />
        </Card>

        <Card>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <Ruler size={14} /> <Translate>Tumor characteristics</Translate>
          </p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft"><Translate>Histology</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{latestReport.histology}</Translate></dd>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft"><Translate>Tumor size</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{latestReport.tumorSizeCm.toString() + ' cm'}</Translate></dd>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft"><Translate>Grade</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{latestReport.grade}</Translate></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft"><Translate>Lymph nodes</Translate></dt>
              <dd className="font-medium text-ink"><Translate>{latestReport.lymphNodeStatus}</Translate></dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="mt-6">
        <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
          <ListTree size={14} /> <Translate>Receptor status</Translate>
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {latestReport.receptors.map((r) => (
            <BiomarkerCard key={r.name} {...r} />
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-soft">
          <Translate>Extracted medications</Translate>
        </p>
        <div className="space-y-3">
          {latestReport.extractedMedicines.map((m) => (
            <div key={m.name} className="flex items-center justify-between rounded-xl border border-ink/5 p-4">
              <div>
                <p className="text-sm font-medium text-ink"><Translate>{m.name}</Translate></p>
                <p
                  className={`mt-0.5 text-xs ${
                    m.confidence < 75 ? 'text-rose-600' : 'text-ink-soft'
                  }`}
                >
                  <Translate>{m.note}</Translate>
                </p>
              </div>
              <ConfidenceRing value={m.confidence} size={48} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
