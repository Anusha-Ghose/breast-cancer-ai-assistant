import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { translateTextBatch } from '../../services/api'
import { translatePhrase } from '../../data/translations'

const translationCache = {}
let pendingQueue = []
let batchTimer = null

const processBatch = async () => {
  const currentQueue = pendingQueue
  pendingQueue = []
  if (currentQueue.length === 0) return

  const byLang = {}
  currentQueue.forEach(item => {
    if (!byLang[item.lang]) byLang[item.lang] = []
    byLang[item.lang].push(item)
  })

  for (const lang of Object.keys(byLang)) {
    const items = byLang[lang]
    const CHUNK_SIZE = 12
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      const chunk = items.slice(i, i + CHUNK_SIZE)
      const texts = chunk.map(i => i.text)

      try {
        const res = await translateTextBatch(texts, lang)
        const translatedTexts = res.data.translated_texts || texts
        
        chunk.forEach((item, index) => {
          item.resolve(translatedTexts[index] || item.text)
        })
      } catch (err) {
        console.error('Batch translation error:', err)
        chunk.forEach(item => item.resolve(item.text))
      }
    }
  }
}

const requestTranslation = (text, lang) => {
  return new Promise((resolve) => {
    pendingQueue.push({ text, lang, resolve })
    if (batchTimer) clearTimeout(batchTimer)
    batchTimer = setTimeout(processBatch, 40)
  })
}

function extractText(children) {
  if (children === null || children === undefined) return ''
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children.props && children.props.children) return extractText(children.props.children)
  return ''
}

export default function Translate({ children }) {
  const { lang } = useLanguage()
  const rawText = extractText(children).trim()
  
  // Check instant dictionary translation
  const dictTranslation = lang === 'en' ? rawText : translatePhrase(rawText, lang)
  const [translated, setTranslated] = useState(dictTranslation || rawText || children)

  useEffect(() => {
    if (!rawText || lang === 'en') {
      setTranslated(rawText || children)
      return
    }

    // 1. Check instant local dictionary
    const local = translatePhrase(rawText, lang)
    if (local) {
      setTranslated(local)
      return
    }

    // 2. Check local memory cache
    const cacheKey = `${lang}:${rawText}`
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey])
      return
    }

    // 3. Fallback to high-speed backend AI batch translation
    let isMounted = true
    requestTranslation(rawText, lang).then((result) => {
      if (isMounted && result) {
        translationCache[cacheKey] = result
        setTranslated(result)
      }
    })

    return () => { isMounted = false }
  }, [lang, rawText])

  if (!rawText) return children
  return <>{translated}</>
}
