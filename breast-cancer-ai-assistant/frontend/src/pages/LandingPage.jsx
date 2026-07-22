import { Link } from 'react-router-dom'
import { ArrowRight, ScanLine, BrainCircuit, LineChart, ShieldCheck } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import ConfidenceRing from '../components/common/ConfidenceRing.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import Translate from '../components/common/Translate.jsx'

const PILLARS = [
  {
    icon: ScanLine,
    title: 'Reads every document',
    body: 'Mammograms, biopsy reports, tumor-marker bloodwork, and handwritten oncologist notes — one upload, fully digitized.',
  },
  {
    icon: BrainCircuit,
    title: 'Explains it plainly',
    body: 'BI-RADS scores, receptor status, and grading translated into language you can actually act on.',
  },
  {
    icon: LineChart,
    title: 'Tracks your timeline',
    body: 'Tumor markers and imaging findings compared visit over visit, so trends surface early.',
  },
]

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <section className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-rose-600">
            <Translate>Breast health copilot</Translate>
          </p>
          <h1 className="font-display text-4xl leading-[1.1] text-ink md:text-5xl">
            <Translate>Every report,</Translate>
            <br />
            <span className="text-rose-600"><Translate>understood.</Translate></span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft"><Translate>{t('tagline')}</Translate></p>
          <p className="mt-2 max-w-md text-ink-soft">
            <Translate>Upload a mammogram, pathology report, or bloodwork panel, and Halcyon turns dense clinical language into a clear picture of where you stand — grounded in your own records, never guessed.</Translate>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/upload"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-porcelain transition hover:bg-ink-light"
            >
              <Translate>Upload a report</Translate>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/report"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
            >
              <Translate>See a sample report</Translate>
            </Link>
          </div>
        </div>

        <Card className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                <Translate>Extraction confidence</Translate>
              </p>
              <p className="font-display text-2xl text-ink"><Translate>Pathology report</Translate></p>
            </div>
            <ShieldCheck className="text-sage-500" size={22} />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <ConfidenceRing value={97} size={72} />
            <div>
              <p className="text-sm font-medium text-ink"><Translate>ER receptor status</Translate></p>
              <p className="text-sm text-ink-soft"><Translate>Positive · 92% staining</Translate></p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <ConfidenceRing value={74} size={72} />
            <div>
              <p className="text-sm font-medium text-ink"><Translate>Ki-67 proliferation index</Translate></p>
              <p className="text-sm text-ink-soft"><Translate>Intermediate · verify with your doctor</Translate></p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-900">
            <Translate>"Your tumor is hormone-receptor positive, which generally responds well to hormone-blocking treatment."</Translate>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="h-full">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
              <Icon size={18} />
            </div>
            <h3 className="font-display text-lg text-ink"><Translate>{title}</Translate></h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft"><Translate>{body}</Translate></p>
          </Card>
        ))}
      </section>
    </div>
  )
}
