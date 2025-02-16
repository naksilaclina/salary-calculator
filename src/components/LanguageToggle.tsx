'use client'

import { useLanguage } from './providers/language-provider'

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    return (
        <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
        >
            {language === 'tr' ? 'EN' : 'TR'}
        </button>
    )
} 