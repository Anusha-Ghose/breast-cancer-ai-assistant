import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { DICTIONARY, translatePhrase } from '../data/translations'

const LANGUAGES = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  bn: { label: 'Bengali', native: 'বাংলা' },
}

const LanguageContext = createContext(null)

// Walk DOM and translate text nodes and attributes
function translateDOM(targetLang) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const root = document.getElementById('root')
  if (!root) return

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        const tag = parent.tagName.toLowerCase()
        if (tag === 'script' || tag === 'style' || tag === 'noscript') return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  let node
  while ((node = walker.nextNode())) {
    if (!node._originalText) {
      node._originalText = node.nodeValue
    }

    if (targetLang === 'en') {
      if (node.nodeValue !== node._originalText) {
        node.nodeValue = node._originalText
      }
    } else {
      const translated = translatePhrase(node._originalText.trim(), targetLang)
      if (translated) {
        const leading = node._originalText.match(/^\s*/)?.[0] || ''
        const trailing = node._originalText.match(/\s*$/)?.[0] || ''
        node.nodeValue = `${leading}${translated}${trailing}`
      }
    }
  }

  // Also translate input placeholders and select options
  const inputs = root.querySelectorAll('input[placeholder], textarea[placeholder]')
  inputs.forEach(input => {
    if (!input._originalPlaceholder) {
      input._originalPlaceholder = input.getAttribute('placeholder')
    }
    if (targetLang === 'en') {
      input.setAttribute('placeholder', input._originalPlaceholder)
    } else {
      const translated = translatePhrase(input._originalPlaceholder.trim(), targetLang)
      if (translated) {
        input.setAttribute('placeholder', translated)
      }
    }
  })

  const options = root.querySelectorAll('option')
  options.forEach(opt => {
    if (!opt._originalText) {
      opt._originalText = opt.textContent
    }
    if (targetLang === 'en') {
      opt.textContent = opt._originalText
    } else {
      const translated = translatePhrase(opt._originalText.trim(), targetLang)
      if (translated) {
        opt.textContent = translated
      }
    }
  })
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('user_language') || 'en'
  })
  const observerRef = useRef(null)

  useEffect(() => {
    // Initial DOM translation
    translateDOM(lang)

    // Setup MutationObserver to continuously translate any dynamically added content
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (lang !== 'en') {
      let timeoutId = null
      observerRef.current = new MutationObserver(() => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          translateDOM(lang)
        }, 50)
      })

      const root = document.getElementById('root')
      if (root) {
        observerRef.current.observe(root, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lang])

  const setLang = (newLang) => {
    setLangState(newLang)
    localStorage.setItem('user_language', newLang)
    translateDOM(newLang)
  }

  const t = (key) => {
    if (!key) return ''
    if (lang === 'en') return key
    return translatePhrase(key, lang) || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
