import { useState } from 'react'
import { Sparkles, Compass, CheckCircle2, AlertTriangle, BookOpen, Clock, ShieldCheck, ArrowRight, Activity, Stethoscope } from 'lucide-react'
import Translate from '../components/common/Translate.jsx'

const PATHWAYS = {
  'HR+/HER2-': {
    title: 'HR+ / HER2- Subtype (Hormone Receptor Positive)',
    description: 'The most common subtype of breast cancer. Systemic therapy focuses on endocrine (hormone-blocking) agents to prevent recurrence.',
    sequence: [
      '1. Primary Surgery (Lumpectomy or Mastectomy)',
      '2. Adjuvant Radiation (if lumpectomy or node-positive)',
      '3. Adjuvant Endocrine Therapy (5–10 years)',
      '4. Targeted Therapy (CDK4/6 Inhibitors if high risk)'
    ],
    steps: [
      {
        id: 's1',
        phase: 'Phase 1: Surgical Intervention',
        title: 'Lumpectomy or Mastectomy + Sentinel Node Biopsy',
        duration: '1 – 3 weeks recovery',
        purpose: 'Surgical excision of primary tumor with intraoperative axillary lymph node staging.',
        options: [
          'Breast-Conserving Surgery (BCS / Lumpectomy)',
          'Total Mastectomy with Immediate/Delayed Reconstruction',
          'Sentinel Lymph Node Dissection (SLND)'
        ],
        sideEffects: ['Post-surgical soreness', 'Mild upper arm tightness', 'Seroma fluid collection (5-10%)'],
        evidence: 'NCCN Guidelines Version 4.2025 - Invasive Breast Cancer (BINV-4)'
      },
      {
        id: 's2',
        phase: 'Phase 2: Radiation Therapy',
        title: 'Adjuvant Whole Breast / Nodal Irradiation',
        duration: '3 – 5 weeks (daily sessions)',
        purpose: 'Eradicate microscopic residual disease, reducing 10-year local recurrence risk by >50%.',
        options: [
          'Hypofractionated Whole Breast Irradiation (15–16 fractions)',
          'Accelerated Partial Breast Irradiation (APBI)'
        ],
        sideEffects: ['Localized skin redness / hyperpigmentation', 'Mild treatment fatigue', 'Tissue firmness'],
        evidence: 'ASTRO Clinical Practice Guidelines for Breast Radiation'
      },
      {
        id: 's3',
        phase: 'Phase 3: Systemic Endocrine Therapy',
        title: 'Aromatase Inhibitors or Selective Estrogen Receptor Modulators',
        duration: '5 to 10 years continuous daily oral',
        purpose: 'Deprive hormone-sensitive cells of estrogen signals, preventing late distant metastasis.',
        options: [
          'Aromatase Inhibitors (Letrozole, Anastrozole, Exemestane)',
          'Tamoxifen (SERM for pre/postmenopausal patients)',
          'Ovarian Function Suppression (Goserelin / Leuprolide)'
        ],
        sideEffects: ['Joint stiffness / arthralgia', 'Vasomotor hot flashes', 'Bone density reduction (monitored via DEXA)'],
        evidence: 'ASCO Endocrine Therapy Guidelines (Journal of Clinical Oncology 2024)'
      },
      {
        id: 's4',
        phase: 'Phase 4: Targeted Risk-Reduction',
        title: 'CDK4/6 Inhibitor Combination Therapy',
        duration: '2 years continuous',
        purpose: 'Inhibits cyclin-dependent kinases 4 & 6 to block tumor cell cycle progression in node-positive high-risk cases.',
        options: [
          'Abemaciclib (Verzenio) + Endocrine Therapy',
          'Ribociclib (Kisqali) + Aromatase Inhibitor'
        ],
        sideEffects: ['Mild manageable diarrhea', 'Transient neutropenia', 'Fatigue'],
        evidence: 'monarchE Phase III Clinical Trial (JCO 2023)'
      }
    ]
  },
  'HER2+': {
    title: 'HER2+ Subtype (Human Epidermal Growth Factor Receptor 2 Positive)',
    description: 'HER2-positive breast cancers express high levels of the HER2 protein. Highly responsive to targeted anti-HER2 monoclonal antibodies.',
    sequence: [
      '1. Neoadjuvant Chemotherapy + Dual HER2 Blockade',
      '2. Definitive Surgery',
      '3. Adjuvant Targeted Anti-HER2 Therapy (1 Year Total)',
      '4. Radiation & Endocrine Therapy (if ER+)'
    ],
    steps: [
      {
        id: 'h1',
        phase: 'Phase 1: Neoadjuvant Systemic Therapy',
        title: 'Chemotherapy + Dual Anti-HER2 Blockade (Trastuzumab + Pertuzumab)',
        duration: '18 – 24 weeks (6 cycles)',
        purpose: 'Pre-operative targeted regression to maximize Pathologic Complete Response (pCR) rate.',
        options: [
          'TCHP Regimen (Docetaxel, Carboplatin, Trastuzumab, Pertuzumab)',
          'AC-THP Regimen'
        ],
        sideEffects: ['Temporary hair thinning', 'Diarrhea', 'Reversible LVEF cardiac drop (monitored via ECHO)'],
        evidence: 'NEOSPHERE & TRYPHAENA Clinical Trials (Lancet Oncology)'
      },
      {
        id: 'h2',
        phase: 'Phase 2: Definitive Surgery',
        title: 'Post-Neoadjuvant Surgical Resection',
        duration: '2 – 4 weeks recovery',
        purpose: 'Resection of residual primary tumor bed with pathological evaluation of treatment response.',
        options: [
          'Lumpectomy with Targeted Axillary Dissection',
          'Total Mastectomy'
        ],
        sideEffects: ['Post-op wound healing', 'Axillary numbness'],
        evidence: 'NCCN Breast Cancer Guidelines (BINV-6)'
      },
      {
        id: 'h3',
        phase: 'Phase 3: Adjuvant Targeted Completion',
        title: 'Trastuzumab Emtansine (T-DM1) or HP Completion',
        duration: 'Completion of 1 year total HER2 blockade',
        purpose: 'Antibody-drug conjugate T-DM1 significantly improves disease-free survival if residual tumor remains.',
        options: [
          'T-DM1 (Kadcyla) for non-pCR residual disease',
          'Trastuzumab + Pertuzumab continuation for pCR'
        ],
        sideEffects: ['Mild platelet reduction (Thrombocytopenia)', 'Mild peripheral neuropathy'],
        evidence: 'KATHERINE Phase III Trial (New England Journal of Medicine 2019)'
      }
    ]
  },
  'Triple Negative': {
    title: 'Triple Negative Breast Cancer (TNBC)',
    description: 'Estrogen, progesterone, and HER2 receptors are negative. Treated with immunotherapy, platinum chemotherapy, and targeted PARP inhibitors if BRCA-mutated.',
    sequence: [
      '1. Neoadjuvant Chemo-Immunotherapy (Pembrolizumab + Platinum Chemotherapy)',
      '2. Definitive Surgery',
      '3. Adjuvant Pembrolizumab Immunotherapy',
      '4. Adjuvant PARP Inhibitor (Olaparib if germline BRCA+)'
    ],
    steps: [
      {
        id: 't1',
        phase: 'Phase 1: Neoadjuvant Chemo-Immunotherapy',
        title: 'Pembrolizumab (Keytruda) + Carboplatin / Paclitaxel / Anthracycline',
        duration: '24 weeks (8 cycles)',
        purpose: 'Harnesses immune checkpoint inhibition + platinum chemotherapy to achieve maximum pathologic response.',
        options: [
          'KEYNOTE-522 Regimen (Pembrolizumab + Paclitaxel + Carboplatin followed by AC)',
        ],
        sideEffects: ['Immune-mediated fatigue', 'Mild thyroid changes', 'Chemotherapy-induced alopecia'],
        evidence: 'KEYNOTE-522 Phase III Trial (NEJM 2022)'
      },
      {
        id: 't2',
        phase: 'Phase 2: Definitive Surgery',
        title: 'Surgical Excision & Nodal Staging',
        duration: '2 – 3 weeks recovery',
        purpose: 'Surgical evaluation of primary tumor bed to confirm pathologic complete response.',
        options: [
          'Lumpectomy with Radiation',
          'Mastectomy'
        ],
        sideEffects: ['Localized healing soreness'],
        evidence: 'NCCN Guidelines TNBC Management'
      },
      {
        id: 't3',
        phase: 'Phase 3: Adjuvant Immunotherapy & Targeted Therapy',
        title: 'Adjuvant Pembrolizumab ± PARP Inhibitor (Olaparib)',
        duration: 'Up to 1 year total Pembrolizumab',
        purpose: 'Prevents distant relapse and targets BRCA-mutated homologous recombination repair deficiencies.',
        options: [
          'Pembrolizumab 200mg IV every 3 weeks',
          'Olaparib (Lynparza) for germline BRCA1/2 mutation'
        ],
        sideEffects: ['Mild fatigue', 'Transient anemia (with Olaparib)'],
        evidence: 'OlympiA Phase III Trial & KEYNOTE-522 Long-Term Follow-up'
      }
    ]
  }
}

export default function TreatmentJourneyPage() {
  const [selectedSubtype, setSelectedSubtype] = useState('HR+/HER2-')
  const [activeStepId, setActiveStepId] = useState('s1')
  const [stage, setStage] = useState('Stage II')

  const currentPathway = PATHWAYS[selectedSubtype]
  const activeStep = currentPathway.steps.find((s) => s.id === activeStepId) || currentPathway.steps[0]

  return (
    <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-purple-900 to-ink p-8 text-white shadow-2xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/20 px-4 py-1 text-xs font-semibold text-rose-200">
            <Sparkles size={14} />
            <Translate>Interactive Clinical Sandbox</Translate>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            <Translate>Treatment Journey Sandbox</Translate>
          </h1>
          <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
            <Translate>
              Explore evidence-grounded treatment sequences tailored to tumor biological subtypes. Grounded in NCCN and ASCO clinical practice guidelines.
            </Translate>
          </p>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-4">
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider flex items-center gap-2">
            <Compass size={16} className="text-rose-500" />
            <Translate>Select Biological Subtype</Translate>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(PATHWAYS).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedSubtype(key)
                  setActiveStepId(PATHWAYS[key].steps[0].id)
                }}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedSubtype === key
                    ? 'border-rose-500 bg-rose-50/50 text-rose-900 font-semibold shadow-sm'
                    : 'border-ink/10 bg-white text-ink-soft hover:bg-porcelain-dim hover:text-ink'
                }`}
              >
                <div className="text-sm">{key}</div>
                <div className="text-xs text-ink-soft mt-1 font-normal line-clamp-1">
                  {key === 'HR+/HER2-' ? 'Hormone Receptor +' : key === 'HER2+' ? 'HER2 Amplified' : 'Triple Negative'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-4">
          <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-rose-500" />
            <Translate>Clinical Stage</Translate>
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full p-3 bg-porcelain border border-ink/10 rounded-xl text-ink font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="Stage I">Stage I (Early Localized)</option>
            <option value="Stage II">Stage II (Localized / Regional Nodes)</option>
            <option value="Stage III">Stage III (Locally Advanced)</option>
            <option value="Stage IV">Stage IV (Advanced / Metastatic)</option>
          </select>
        </div>
      </div>

      {/* Sequence Roadmap Overview */}
      <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-4">
        <h3 className="font-display font-semibold text-lg text-ink flex items-center gap-2">
          <Stethoscope size={20} className="text-rose-500" />
          {currentPathway.title}
        </h3>
        <p className="text-sm text-ink-soft leading-relaxed">{currentPathway.description}</p>

        <div className="pt-4 border-t border-ink/5">
          <h4 className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-3">
            <Translate>Recommended Sequence Pathway</Translate>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentPathway.sequence.map((seq, idx) => (
              <div key={idx} className="p-3 bg-porcelain rounded-xl border border-ink/5 text-xs text-ink font-medium flex items-center gap-2">
                <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="line-clamp-2">{seq.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Step Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Navigation Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-ink-soft uppercase tracking-wider px-1">
            <Translate>Treatment Sequence Steps</Translate>
          </h4>
          {currentPathway.steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`w-full p-4 rounded-2xl text-left border transition-all ${
                activeStepId === step.id
                  ? 'border-rose-500 bg-white shadow-md ring-2 ring-rose-500/10'
                  : 'border-ink/10 bg-white/70 hover:bg-white text-ink-soft hover:text-ink'
              }`}
            >
              <div className="text-xs font-semibold text-rose-500">{step.phase}</div>
              <div className="font-display font-semibold text-sm text-ink mt-1">{step.title}</div>
              <div className="flex items-center gap-2 text-xs text-ink-soft mt-2">
                <Clock size={14} />
                <span>{step.duration}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Step Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-ink/5 pb-4">
            <div>
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">{activeStep.phase}</span>
              <h3 className="font-display font-semibold text-xl text-ink mt-1">{activeStep.title}</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full border border-rose-100">
              <Clock size={14} />
              {activeStep.duration}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Clinical Purpose</h4>
            <p className="text-sm text-ink leading-relaxed bg-porcelain p-4 rounded-xl border border-ink/5">
              {activeStep.purpose}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Standard Clinical Options</h4>
            <div className="space-y-2">
              {activeStep.options.map((opt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-ink">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Commonly Reported Side Effects & Management</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeStep.sideEffects.map((se, idx) => (
                <div key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                  <span>{se}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-ink/5 flex items-center gap-2 text-xs text-ink-soft">
            <BookOpen size={16} className="text-rose-500 shrink-0" />
            <span><strong className="text-ink">Literature Evidence Grounding:</strong> {activeStep.evidence}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
