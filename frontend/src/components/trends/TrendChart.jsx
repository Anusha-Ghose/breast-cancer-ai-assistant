import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import Translate from '../common/Translate.jsx'

export default function TrendChart({ data, unit, referenceValue, color = '#B76E79' }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 w-full flex flex-col items-center justify-center text-center p-6 bg-porcelain/40 rounded-2xl border border-dashed border-ink/10">
        <p className="text-sm font-medium text-ink">
          <Translate>No biomarker trend data yet</Translate>
        </p>
        <p className="text-xs text-ink-soft mt-1">
          <Translate>Upload pathology or lab reports to visualize visit-over-visit biomarker trajectories.</Translate>
        </p>
      </div>
    )
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 40, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#1B2A4114" vertical={false} />
          <XAxis dataKey="visit" tick={{ fontSize: 12, fill: '#4A5D73' }} axisLine={false} tickLine={false} />
          <YAxis 
             tick={{ fontSize: 12, fill: '#4A5D73' }} 
             axisLine={false} 
             tickLine={false} 
             width={40} 
             domain={[0, dataMax => Math.max(10, Math.ceil((Number.isFinite(dataMax) ? dataMax : 10) * 1.25))]} 
          />
          {referenceValue && (
            <ReferenceLine y={referenceValue} stroke="#4F7C74" strokeDasharray="4 4" label={{ value: 'Normal range', position: 'insideTopRight', fontSize: 10, fill: '#4F7C74' }} />
          )}
          <Tooltip
            formatter={(value) => [`${value} ${unit || ''}`, '']}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.label ?? label}
            contentStyle={{ borderRadius: 12, border: '1px solid #1B2A4114', fontSize: 12 }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 4, fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
