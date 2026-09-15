import { createContext, useContext, useState } from 'react'

const LANGUAGES = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  bn: { label: 'Bengali', native: 'বাংলা' },
}

const STRINGS = {
  en: {
    tagline: 'Your reports, explained in plain language.',
    lowConfidence: 'Low confidence — please verify with your doctor',
    highConfidence: 'High confidence — verified extraction',
    askPlaceholder: 'Ask a question about your report…',
  },
  hi: {
    tagline: 'आपकी रिपोर्ट, सरल भाषा में समझाई गई।',
    lowConfidence: 'कम विश्वसनीयता — कृपया डॉक्टर से पुष्टि करें',
    highConfidence: 'उच्च विश्वसनीयता — सत्यापित निष्कर्षण',
    askPlaceholder: 'अपनी रिपोर्ट के बारे में एक प्रश्न पूछें…',
  },
  ta: {
    tagline: 'உங்கள் அறிக்கைகள், எளிய மொழியில்.',
    lowConfidence: 'குறைந்த நம்பகத்தன்மை — மருத்துவரிடம் சரிபார்க்கவும்',
    highConfidence: 'உயர் நம்பகத்தன்மை — சரிபார்க்கப்பட்டது',
    askPlaceholder: 'உங்கள் அறிக்கை பற்றிய கேள்வியைக் கேளுங்கள்…',
  },
  bn: {
    tagline: 'আপনার রিপোর্ট, সহজ ভাষায়।',
    lowConfidence: 'কম নির্ভরযোগ্যতা — ডাক্তারের সাথে যাচাই করুন',
    highConfidence: 'উচ্চ নির্ভরযোগ্যতা — যাচাইকৃত তথ্য',
    askPlaceholder: 'আপনার রিপোর্ট সম্পর্কে একটি প্রশ্ন জিজ্ঞাসা করুন…',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key

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
