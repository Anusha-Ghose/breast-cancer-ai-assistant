import { ShieldAlert, Clock, AlertCircle, Stethoscope, ChevronRight } from 'lucide-react'
import Translate from '../common/Translate.jsx'

const TRIAGE_CONFIG = {
  Red: {
    bg: 'bg-red-500',
    lightBg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badgeText: 'text-white bg-red-600',
    iconColor: 'text-red-500',
    name: 'Category 1: Immediate Emergency (Red)'
  },
  Orange: {
    bg: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    badgeText: 'text-white bg-orange-600',
    iconColor: 'text-orange-500',
    name: 'Category 2: Very Urgent (Orange)'
  },
  Yellow: {
    bg: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badgeText: 'text-amber-900 bg-amber-200',
    iconColor: 'text-amber-500',
    name: 'Category 3: Urgent (Yellow)'
  },
  Green: {
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    badgeText: 'text-white bg-emerald-600',
    iconColor: 'text-emerald-500',
    name: 'Category 4: Standard Surveillance (Green)'
  },
  Blue: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badgeText: 'text-white bg-blue-600',
    iconColor: 'text-blue-500',
    name: 'Category 5: Non-Urgent Inquiry (Blue)'
  }
}

export default function MTSTriageCard({ triage }) {
  if (!triage) return null

  const colorKey = triage.triage_color || 'Green'
  const config = TRIAGE_CONFIG[colorKey] || TRIAGE_CONFIG.Green

  return (
    <div className={`rounded-2xl p-6 border ${config.border} ${config.lightBg} shadow-sm space-y-4`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.bg} animate-pulse`} />
          <span className="font-display font-semibold text-lg text-ink">
            <Translate>Manchester Triage System (MTS) Assessment</Translate>
          </span>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${config.badgeText}`}>
          <Translate>{triage.triage_level_name || config.name}</Translate>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-black/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft uppercase tracking-wider">
            <Clock size={16} className={config.iconColor} />
            <Translate>Target Response Window</Translate>
          </div>
          <div className="text-xl font-bold text-ink">
            <Translate>{triage.target_time_minutes === 0 ? 'Immediate / STAT' : `< ${triage.target_time_minutes} minutes`}</Translate>
          </div>
          <p className="text-xs text-ink-soft">
            <Translate>Clinical timeframe recommendation based on findings.</Translate>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-black/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft uppercase tracking-wider">
            <ShieldAlert size={16} className={config.iconColor} />
            <Translate>Key Clinical Indicators</Translate>
          </div>
          <div className="space-y-1">
            {(triage.clinical_indicators || ['Stable parameters']).map((ind, idx) => (
              <div key={idx} className="text-xs font-medium text-ink flex items-center gap-1.5">
                <ChevronRight size={14} className={config.iconColor} />
                <span><Translate>{ind}</Translate></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-xl p-4 border border-black/5 space-y-3">
        <div className="flex items-start gap-2">
          <Stethoscope size={18} className={`${config.iconColor} shrink-0 mt-0.5`} />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
              <Translate>Recommended Next Action</Translate>
            </h4>
            <p className="text-sm text-ink leading-relaxed">
              <Translate>{triage.action_recommendation}</Translate>
            </p>
          </div>
        </div>
        {triage.provider_guidance && (
          <p className="text-xs text-ink-soft pt-2 border-t border-black/5">
            <strong><Translate>Clinical Guidance</Translate>:</strong> <Translate>{triage.provider_guidance}</Translate>
          </p>
        )}
      </div>
    </div>
  )
}
