import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Ribbon, Languages, LogOut, User, Sun, Moon } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import LoginModal from '../auth/LoginModal.jsx'
import Translate from '../common/Translate.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview' },
  { to: '/upload', label: 'Upload' },
  { to: '/report', label: 'Report insights' },
  { to: '/trends', label: 'Trends' },
  { to: '/sandbox', label: 'Treatment Sandbox' },
  { to: '/assistant', label: 'Assistant' },
  { to: '/history', label: 'History' },
]

export default function Navbar() {
  const { lang, setLang, LANGUAGES } = useLanguage()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-porcelain/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 sm:px-8 lg:px-12 py-4">
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
                <Translate>{item.label}</Translate>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-ink-soft hover:text-ink hover:bg-porcelain-dim rounded-full transition-colors focus-ring"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
            
            {user ? (
              <div className="flex items-center gap-3 border-l border-ink/10 pl-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-ink font-medium">
                  <div className="w-7 h-7 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span>{user.full_name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-ink-soft hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="border-l border-ink/10 pl-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink-light transition-colors"
                >
                  <User size={16} />
                  <Translate>Sign In</Translate>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
