'use client'

import React, { useState } from 'react'
import { useTheme } from './providers/theme-provider'
import { useLanguage } from './providers/language-provider'
import { hesaplaMaas } from '@/lib/utils/calculations'
import LanguageToggle from './LanguageToggle'
import SalaryInputSection from './sections/SalaryInputSection'
import PeriodSelection from './sections/PeriodSelection'
import WorkingHoursSection from './sections/WorkingHoursSection'
import HolidayWorkSection from './sections/HolidayWorkSection'
import ResultsModal from './sections/ResultsModal'
import ErrorToast from './ui/ErrorToast'

interface FormState {
    tabanMaas: string
    ay: string
    yil: string
    toplamCalisma: string
    tatilVarMi: boolean
    tatilMesai: string
    gunlukCalismaSaati: string
}

interface SonucState {
    saatlikUcret: number
    normalMesai: number
    tatilMesai: number
    normalMesaiUcret: number
    tatilMesaiUcret: number
    toplamMesaiUcret: number
    netMaas: number
}

export default function SalaryCalculatorForm() {
    const { theme, toggleTheme } = useTheme()
    const { translations } = useLanguage()
    const [formData, setFormData] = useState<FormState>({
        tabanMaas: '',
        ay: '',
        yil: new Date().getFullYear().toString(),
        toplamCalisma: '',
        tatilVarMi: false,
        tatilMesai: '',
        gunlukCalismaSaati: '9'
    })
    const [sonuclar, setSonuclar] = useState<SonucState | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const sonuc = hesaplaMaas({
                tabanMaas: Number(formData.tabanMaas),
                ay: Number(formData.ay),
                yil: Number(formData.yil),
                toplamCalisma: Number(formData.toplamCalisma),
                tatilVarMi: formData.tatilVarMi,
                tatilMesai: Number(formData.tatilMesai),
                gunlukCalismaSaati: Number(formData.gunlukCalismaSaati)
            })

            setSonuclar(sonuc)
            setShowModal(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen py-8 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="glass-morphism rounded-2xl shadow-xl transition-all duration-300 animate-fade-in">
                    <div className="px-8 py-10 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                                    {translations.title}
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                                    {translations.subtitle}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Temayı Değiştir"
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                            />
                                        </svg>
                                    )}
                                </button>
                                <LanguageToggle />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <SalaryInputSection
                            formData={formData}
                            translations={translations}
                            handleInputChange={handleInputChange}
                        />

                        <PeriodSelection
                            formData={formData}
                            translations={translations}
                            handleInputChange={handleInputChange}
                        />

                        <WorkingHoursSection
                            formData={formData}
                            translations={translations}
                            handleInputChange={handleInputChange}
                        />

                        <HolidayWorkSection
                            formData={formData}
                            translations={translations}
                            handleInputChange={handleInputChange}
                            setFormData={setFormData}
                        />

                        {/* Hesapla ve Sıfırla Butonları */}
                        <div className="grid grid-cols-2 gap-4 pt-4 animate-slide-in" style={{ ['--animation-order' as any]: 8 }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        tabanMaas: '',
                                        ay: '',
                                        yil: new Date().getFullYear().toString(),
                                        toplamCalisma: '',
                                        tatilVarMi: false,
                                        tatilMesai: '',
                                        gunlukCalismaSaati: '9'
                                    })
                                    setSonuclar(null)
                                    setShowModal(false)
                                    setError(null)
                                }}
                                className="w-full py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {translations.buttons.reset}
                            </button>
                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {translations.buttons.calculate}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ResultsModal
                showModal={showModal}
                sonuclar={sonuclar}
                formData={formData}
                translations={translations}
                setShowModal={setShowModal}
            />

            <ErrorToast error={error} />
        </div>
    )
} 