import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { translateTextBatch } from '../../services/api'

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
    
    // Process in smaller chunks sequentially to respect API rate limits
    const CHUNK_SIZE = 8
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
    batchTimer = setTimeout(processBatch, 50)
  })
}

export default function Translate({ children }) {
  const { lang } = useLanguage()
  const [translated, setTranslated] = useState(children)

  useEffect(() => {
    if (!children || typeof children !== 'string') {
      setTranslated(children)
      return
    }

    if (lang === 'en') {
      setTranslated(children)
      return
    }

    const cacheKey = `${lang}:${children}`
    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey])
      return
    }

    let isMounted = true

    requestTranslation(children, lang).then((result) => {
      if (isMounted) {
        translationCache[cacheKey] = result
        setTranslated(result)
      }
    })

    return () => { isMounted = false }
  }, [lang, children])

  return <>{translated}</>
}
