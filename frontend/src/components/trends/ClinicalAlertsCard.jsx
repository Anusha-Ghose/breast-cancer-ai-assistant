import { AlertTriangle, ShieldCheck, Stethoscope } from 'lucide-react'
import Translate from '../common/Translate.jsx'

export default function ClinicalAlertsCard({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-ink">
              <Translate>Proactive Clinical Alerts</Translate>
            </h3>
            <p className="text-xs text-ink-soft">
              <Translate>System identifies meaningful longitudinal changes to support clinical decision-making with your doctor.</Translate>
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          <Translate>{alerts.length === 1 ? '1 Alert' : `${alerts.length} Alerts`}</Translate>
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id || alert.title}
            className={`p-4 rounded-xl border transition-all ${
              alert.severity === 'High'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : alert.severity === 'Warning'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-porcelain border-ink/5 text-ink'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm"><Translate>{alert.title}</Translate></span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                    <Translate>{alert.severity}</Translate>
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed"><Translate>{alert.message}</Translate></p>
              </div>
              <span className="text-xs opacity-60 shrink-0"><Translate>{alert.date}</Translate></span>
            </div>

            <div className="mt-3 pt-3 border-t border-black/5 flex items-start gap-2 text-xs">
              <Stethoscope size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold"><Translate>Recommended Doctor Discussion</Translate>: </strong>
                <span><Translate>{alert.recommendation}</Translate></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-porcelain rounded-xl border border-ink/5 text-[11px] text-ink-soft flex items-center gap-2">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span><Translate>This proactive alert system supports clinical decision-making with your physician rather than replacing medical advice.</Translate></span>
      </div>
    </div>
  )
}
