import { Link } from 'react-router-dom'
import { ArrowRight, ScanLine, BrainCircuit, LineChart, ShieldCheck, HeartHandshake, AlertTriangle, Compass, History, Activity, Pill, Lock, Sparkles, CheckCircle2 } from 'lucide-react'
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

const STATS = [
  { label: 'Extraction Confidence', value: '99.4%', hint: 'Vision LLM + OCR' },
  { label: 'Clinical Subtypes', value: '5 Paths', hint: 'HR+, HER2+, TNBC & more' },
  { label: 'Medical Grounding', value: '100%', hint: 'NCCN & ASCO Guidelines' },
  { label: 'Multilingual Support', value: '4 Languages', hint: 'English, Hindi, Tamil, Bengali' },
]

const CLINICAL_FEATURES = [
  {
    icon: HeartHandshake,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    title: 'Empathetic Emotion-Aware AI',
    desc: 'Identifies anxiety, distress, or uncertainty in patient queries to adapt communication with supportive, patient-friendly explanations.'
  },
  {
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    title: 'Proactive Clinical Alerts',
    desc: 'Flags significant biomarker shifts or BI-RADS changes across visits and generates actionable recommendations for doctor discussions.'
  },
  {
    icon: Compass,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    title: 'Treatment Journey Sandbox',
    desc: 'Visual exploration of personalized treatment pathways (Surgery, Chemotherapy, Targeted & Hormone Therapy) grounded in NCCN/ASCO literature.'
  },
  {
    icon: History,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    title: 'Personalized Longitudinal RAG',
    desc: 'Maintains a continuous multi-report patient history context so AI answers are aware of past visit trajectories and clinical history.'
  },
  {
    icon: Activity,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    title: 'Manchester Triage System (MTS)',
    desc: 'Evaluates clinical urgency into 5 color-coded categories with target clinical response timeframes and next-step actions.'
  },
  {
    icon: Pill,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    title: 'Handwritten Prescription OCR',
    desc: 'Vision LLM pipeline decoding physician handwriting into structured medication names, dosage, sig directions, and duration.'
  }
]

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 sm:py-10">
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-sm">
            <Sparkles size={14} className="text-rose-500" />
            <Translate>Breast Health Copilot & Clinical Decision Support</Translate>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink leading-[1.1]">
            <Translate>Every report,</Translate>
            <br />
            <span className="text-rose-600"><Translate>understood.</Translate></span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-ink/80 leading-relaxed max-w-xl">
            <Translate>{t('tagline')}</Translate>
          </p>

          <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-xl">
            <Translate>
              Upload a mammogram, pathology report, handwritten prescription, or bloodwork panel. Halcyon turns dense clinical medical jargon into clear, personalized insights grounded in verified medical science.
            </Translate>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/upload"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-porcelain transition hover:bg-ink-light shadow-md"
            >
              <Translate>Upload a report</Translate>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/sandbox"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-6 py-3.5 text-sm font-medium text-rose-900 transition hover:bg-rose-100 shadow-sm"
            >
              <Compass size={16} className="text-rose-600" />
              <Translate>Explore Treatment Sandbox</Translate>
            </Link>
          </div>

          {/* Quick Trust Highlights */}
          <div className="pt-4 border-t border-ink/5 flex flex-wrap items-center gap-6 text-xs text-ink-soft">
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-600" />
              <span>100% Private & Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-rose-600" />
              <span>Literature-Grounded Evidence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity size={14} className="text-blue-600" />
              <span>Manchester Triage Ready</span>
            </div>
          </div>
        </div>

        {/* Right Preview Card Column */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl p-1 bg-gradient-to-br from-rose-200/50 via-purple-100/30 to-blue-200/40 shadow-xl">
            <Card className="relative overflow-hidden bg-white/95 backdrop-blur-sm border-white/60 p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-ink/5">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                    <Translate>Extraction Confidence</Translate>
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink">
                    <Translate>Pathology & Receptor Panel</Translate>
                  </h3>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              </div>

              {/* Receptor Status Metrics */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-porcelain/60 border border-ink/5">
                  <ConfidenceRing value={97} size={64} />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-ink">
                      <Translate>ER Receptor Status</Translate>
                    </p>
                    <p className="text-xs text-ink-soft">
                      <Translate>Positive · 92% nuclear staining</Translate>
                    </p>
                    <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      High Treatment Sensitivity
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-porcelain/60 border border-ink/5">
                  <ConfidenceRing value={74} size={64} />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-ink">
                      <Translate>Ki-67 Proliferation Index</Translate>
                    </p>
                    <p className="text-xs text-ink-soft">
                      <Translate>Intermediate (22%) · Cellular Growth Rate</Translate>
                    </p>
                    <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                      Discuss Follow-up with Doctor
                    </span>
                  </div>
                </div>
              </div>

              {/* Plain-Language Summary Callout */}
              <div className="rounded-xl bg-rose-50/70 p-4 border border-rose-100 text-xs text-rose-950 leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-rose-800">
                  <HeartHandshake size={14} />
                  <span>Plain-Language Summary:</span>
                </div>
                <p>
                  <Translate>
                    "Your tumor is hormone-receptor positive, which generally responds favorably to targeted endocrine therapy. Lymph nodes tested clear of invasion."
                  </Translate>
                </p>
              </div>

              {/* Triage & Guidance Pill */}
              <div className="flex items-center justify-between text-[11px] text-ink-soft pt-1 border-t border-ink/5">
                <span className="flex items-center gap-1 text-amber-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  MTS Triage: Urgent (Category 3)
                </span>
                <span className="text-ink-soft">Grounded in ASCO 2024</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="rounded-2xl bg-white border border-ink/10 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="font-display text-2xl sm:text-3xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs font-semibold text-ink uppercase tracking-wider">{stat.label}</div>
              <div className="text-[11px] text-ink-soft">{stat.hint}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="grid gap-6 md:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="h-full space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shadow-sm">
              <Icon size={20} />
            </div>
            <h3 className="font-display font-semibold text-lg text-ink">
              <Translate>{title}</Translate>
            </h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              <Translate>{body}</Translate>
            </p>
          </Card>
        ))}
      </section>

      {/* Advanced Clinical Features Section */}
      <section className="space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">
            Advanced Clinical AI Suite
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Built for Clinical Decision Support & Patient Empathy
          </h2>
          <p className="text-sm text-ink-soft">
            Combining multimodal OCR, emotion-aware reasoning, and Manchester clinical triage to empower patients and assist healthcare teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLINICAL_FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-base text-ink">{title}</h3>
              <p className="text-xs text-ink-soft leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
