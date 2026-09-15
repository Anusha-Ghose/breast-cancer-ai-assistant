import { NavLink } from 'react-router-dom'
import { Home, Upload, Compass, TrendingUp, MessageCircle, Clock } from 'lucide-react'
import Translate from '../common/Translate.jsx'

const TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/sandbox', label: 'Sandbox', icon: Compass },
  { to: '/trends', label: 'Trends', icon: TrendingUp },
  { to: '/assistant', label: 'Chat', icon: MessageCircle },
]

export default function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-ink/5 bg-white py-2 md:hidden">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${
              isActive ? 'text-rose-600' : 'text-ink-soft'
            }`
          }
        >
          <Icon size={20} strokeWidth={2} />
          <Translate>{label}</Translate>
        </NavLink>
      ))}
    </nav>
  )
}
