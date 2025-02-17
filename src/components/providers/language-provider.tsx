'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import trLocale from '@/locales/tr.json'
import enLocale from '@/locales/en.json'

type Language = 'tr' | 'en'

interface TranslationType {
    title: string
    subtitle: string
    form: {
        baseSalary: {
            label: string
            tooltip: string
            placeholder: string
        }
        period: {
            label: string
            selectMonth: string
        }
        dailyWorkHours: {
            label: string
            tooltip: string
            placeholder: string
        }
        totalWorkHours: {
            label: string
            tooltip: string
        }
        holidayWork: {
            label: string
            tooltip: string
            hasHoliday: string
            noHoliday: string
            hours: {
                label: string
                tooltip: string
            }
        }
    }
    buttons: {
        calculate: string
        save: string
    }
    results: {
        title: string
        baseSalary: string
        totalWork: string
        hourlyRate: string
        normalOvertime: string
        holidayOvertime: string
        hours: string
        totalOvertimePay: string
        totalDeduction: string
        holidayOvertimePay: string
        netSalary: string
        calculation: {
            withOvertime: string
            withDeduction: string
            withHoliday: string
        }
    }
    history: {
        title: string
        empty: string
        period: string
    }
    months: {
        [key: string]: string
    }
}

interface LanguageContextType {
    language: Language
    translations: TranslationType
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr')
    const [translations, setTranslations] = useState<TranslationType>(trLocale as TranslationType)

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang) {
            setLanguage(savedLang)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('language', language)
        setTranslations(language === 'tr' ? trLocale as TranslationType : enLocale as TranslationType)
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