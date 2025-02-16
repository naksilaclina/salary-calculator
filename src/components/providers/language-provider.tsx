'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import trLocale from '@/locales/tr.json'
import enLocale from '@/locales/en.json'

type Language = 'tr' | 'en'
type Translations = typeof trLocale

interface LanguageContextType {
    language: Language
    translations: Translations
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr')
    const [translations, setTranslations] = useState<Translations>(trLocale)

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang) {
            setLanguage(savedLang)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('language', language)
        setTranslations(language === 'tr' ? trLocale : enLocale)
    }, [language])

    return (
        <LanguageContext.Provider value={{ language, translations, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
} 