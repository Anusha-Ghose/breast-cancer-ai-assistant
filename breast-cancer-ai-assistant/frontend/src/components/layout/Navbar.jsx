import { NavLink } from 'react-router-dom'
import { Ribbon, Languages } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview' },
  { to: '/upload', label: 'Upload' },
  { to: '/report', label: 'Report insights' },
  { to: '/trends', label: 'Trends' },
  { to: '/assistant', label: 'Assistant' },
]

export default function Navbar() {
  const { lang, setLang, LANGUAGES } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-porcelain/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white">
            <Ribbon size={18} strokeWidth={2} />
          </div>
          <span className="font-display text-lg tracking-tight text-ink">Halcyon</span>
        </div>

        <nav className="hidden gap-1 rounded-full border border-ink/5 bg-white p-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-ring ${
                  isActive ? 'bg-ink text-porcelain' : 'text-ink-soft hover:bg-porcelain-dim'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Languages size={16} className="text-ink-soft" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="focus-ring rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm text-ink"
          >
            {Object.entries(LANGUAGES).map(([code, meta]) => (
              <option key={code} value={code}>
                {meta.native}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
