'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from './providers/theme-provider'
import { useLanguage } from './providers/language-provider'
import { hesaplaMaas, formatPara, formatSaat, hesaplaMinimumCalisma } from '@/lib/utils/calculations'
import LanguageToggle from './LanguageToggle'

interface FormState {
    tabanMaas: string
    ay: string
    yil: string
    toplamCalisma: string
    tatilVarMi: boolean
    tatilMesai: string
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

export default function MaasHesaplamaForm() {
    const { theme, toggleTheme } = useTheme()
    const { translations } = useLanguage()
    const [formData, setFormData] = useState<FormState>({
        tabanMaas: '',
        ay: '',
        yil: new Date().getFullYear().toString(),
        toplamCalisma: '',
        tatilVarMi: false,
        tatilMesai: ''
    })
    const [sonuclar, setSonuclar] = useState<SonucState | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [showFromHistory, setShowFromHistory] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Yerel depolama için yeni state ve fonksiyonlar
    const [savedCalculations, setSavedCalculations] = useState<{name: string, data: FormState}[]>([])
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saveName, setSaveName] = useState('')

    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [calculationHistory, setCalculationHistory] = useState<{
        date: string
        formData: FormState
        sonuclar: SonucState
    }[]>([])

    // Component mount olduğunda kayıtlı hesaplamaları yükle
    useEffect(() => {
        const saved = localStorage.getItem('maasHesaplamaKayitlar')
        if (saved) {
            setSavedCalculations(JSON.parse(saved))
        }
    }, [])

    // Component mount olduğunda geçmiş hesaplamaları yükle
    useEffect(() => {
        const saved = localStorage.getItem('maasHesaplamaGecmis')
        if (saved) {
            setCalculationHistory(JSON.parse(saved))
        }
    }, [])

    // Hesaplamayı kaydet
    const handleSave = () => {
        if (!saveName.trim()) return

        const newCalculations = [
            ...savedCalculations,
            { name: saveName, data: formData }
        ]
        
        localStorage.setItem('maasHesaplamaKayitlar', JSON.stringify(newCalculations))
        setSavedCalculations(newCalculations)
        setShowSaveModal(false)
        setSaveName('')
    }

    // Kayıtlı hesaplamayı yükle
    const loadCalculation = (data: FormState) => {
        setFormData(data)
        setShowSaveModal(false)
    }

    // Kayıtlı hesaplamayı sil
    const deleteCalculation = (index: number) => {
        const newCalculations = savedCalculations.filter((_, i) => i !== index)
        localStorage.setItem('maasHesaplamaKayitlar', JSON.stringify(newCalculations))
        setSavedCalculations(newCalculations)
    }

    // Hesaplama geçmişini sil
    const deleteHistoryCalculation = (index: number) => {
        const newHistory = calculationHistory.filter((_, i) => i !== index)
        localStorage.setItem('maasHesaplamaGecmis', JSON.stringify(newHistory))
        setCalculationHistory(newHistory)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setShowFromHistory(false)

        try {
            const sonuc = hesaplaMaas({
                tabanMaas: Number(formData.tabanMaas),
                ay: Number(formData.ay),
                yil: Number(formData.yil),
                toplamCalisma: Number(formData.toplamCalisma),
                tatilVarMi: formData.tatilVarMi,
                tatilMesai: Number(formData.tatilMesai)
            })

            // Hesaplama geçmişine ekle
            const newHistory = [
                {
                    date: new Date().toLocaleString('tr-TR'),
                    formData: { ...formData },
                    sonuclar: sonuc
                },
                ...calculationHistory
            ].slice(0, 5) // Son 5 hesaplamayı tut

            setCalculationHistory(newHistory)
            localStorage.setItem('maasHesaplamaGecmis', JSON.stringify(newHistory))

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

    const handleTatilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tatilVarMi = e.target.value === 'evet'
        setFormData(prev => ({
            ...prev,
            tatilVarMi,
            tatilMesai: tatilVarMi ? prev.tatilMesai : '0'
        }))
    }

    // Yıl seçeneklerini oluştur
    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

    // Ay seçeneklerini oluştur
    const aylar = [
        { value: "1", label: "Ocak" },
        { value: "2", label: "Şubat" },
        { value: "3", label: "Mart" },
        { value: "4", label: "Nisan" },
        { value: "5", label: "Mayıs" },
        { value: "6", label: "Haziran" },
        { value: "7", label: "Temmuz" },
        { value: "8", label: "Ağustos" },
        { value: "9", label: "Eylül" },
        { value: "10", label: "Ekim" },
        { value: "11", label: "Kasım" },
        { value: "12", label: "Aralık" }
    ]

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
                                <LanguageToggle />
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowSaveModal(true)}
                                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        title="Kayıtlı Hesaplamalar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowHistoryModal(true)}
                                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        title="Hesaplama Geçmişi"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            tabanMaas: '',
                                            ay: '',
                                            yil: new Date().getFullYear().toString(),
                                            toplamCalisma: '',
                                            tatilVarMi: false,
                                            tatilMesai: ''
                                        })
                                        setSonuclar(null)
                                        setShowModal(false)
                                        setError(null)
                                    }}
                                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Formu Sıfırla"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </button>
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
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Taban Maaş */}
                        <div className="animate-slide-in" style={{ ['--animation-order' as any]: 1 }}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {translations.form.baseSalary.label}
                                <div className="inline-block ml-1 group relative">
                                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="hidden group-hover:block absolute z-50 w-64 p-2 mt-1 text-sm text-white bg-slate-800 rounded-lg shadow-lg">
                                        {translations.form.baseSalary.tooltip}
                                    </div>
                                </div>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 dark:text-slate-400">₺</span>
                                </div>
                                <input
                                    type="number"
                                    name="tabanMaas"
                                    value={formData.tabanMaas}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    placeholder={translations.form.baseSalary.placeholder}
                                    className="block w-full pl-8 pr-4 py-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Dönem */}
                        <div className="animate-slide-in" style={{ ['--animation-order' as any]: 2 }}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {translations.form.period.label}
                            </label>
                            <div className="relative flex items-center gap-2">
                                <select
                                    name="ay"
                                    value={formData.ay}
                                    onChange={handleInputChange}
                                    className="block w-full pl-3 pr-10 py-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                    required
                                >
                                    <option value="">{translations.form.period.selectMonth}</option>
                                    {aylar.map(ay => {
                                        const minCalisma = hesaplaMinimumCalisma(Number(formData.yil), Number(ay.value))
                                        return (
                                            <option key={ay.value} value={ay.value}>
                                                {translations.months[ay.value as keyof typeof translations.months]} ({minCalisma} {translations.results.hours})
                                            </option>
                                        )
                                    })}
                                </select>
                                <select
                                    name="yil"
                                    value={formData.yil}
                                    onChange={handleInputChange}
                                    className="block min-w-[120px] pl-3 pr-10 py-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                    required
                                >
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Toplam Çalışma Saati */}
                        <div className="animate-slide-in" style={{ ['--animation-order' as any]: 3 }}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {translations.form.totalWorkHours.label}
                                <div className="inline-block ml-1 group relative">
                                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="hidden group-hover:block absolute z-50 w-64 p-2 mt-1 text-sm text-white bg-slate-800 rounded-lg shadow-lg">
                                        {translations.form.totalWorkHours.tooltip}
                                    </div>
                                </div>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-slate-500 dark:text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    name="toplamCalisma"
                                    value={formData.toplamCalisma}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Toplam çalışma saati"
                                    className="block w-full pl-10 pr-4 py-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                    required
                                />
                            </div>
                            {formData.ay && (
                                <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            {(() => {
                                                const minCalisma = hesaplaMinimumCalisma(Number(formData.yil), Number(formData.ay))
                                                return (
                                                    <>
                                                        <p>
                                                            Bu ay minimum çalışma süresi: <span className="font-medium">{formatSaat(minCalisma)} saat</span>
                                                        </p>
                                                        {formData.toplamCalisma && (
                                                            <>
                                                                {Number(formData.toplamCalisma) > minCalisma ? (
                                                                    <p className="text-xs mt-1">
                                                                        <span className="font-medium">{formatSaat(Number(formData.toplamCalisma) - minCalisma)} saat</span> fazla mesai yaptınız
                                                                        <br />
                                                                        Normal mesai ücreti: <span className="font-medium">x1.5</span>
                                                                        {formData.tatilVarMi && ' | Resmi tatil ücreti: x2.0'}
                                                                    </p>
                                                                ) : Number(formData.toplamCalisma) < minCalisma && (
                                                                    <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
                                                                        <span className="font-medium">{formatSaat(minCalisma - Number(formData.toplamCalisma))} saat</span> eksik çalışmanız var
                                                                        <br />
                                                                        Eksik çalışma kesintisi: <span className="font-medium">x1.0</span> (normal saatlik ücret)
                                                                        {formData.tatilVarMi && ' | Resmi tatil ücreti: x2.0'}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resmi Tatil */}
                        <div className="animate-slide-in" style={{ ['--animation-order' as any]: 4 }}>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {translations.form.holidayWork.label}
                                        <div className="inline-block ml-1 group relative">
                                            <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="hidden group-hover:block absolute z-50 w-64 p-2 mt-1 text-sm text-white bg-slate-800 rounded-lg shadow-lg">
                                                {translations.form.holidayWork.tooltip}
                                            </div>
                                        </div>
                                    </label>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {formData.tatilVarMi 
                                            ? translations.form.holidayWork.hasHoliday
                                            : translations.form.holidayWork.noHoliday}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        tatilVarMi: !prev.tatilVarMi,
                                        tatilMesai: !prev.tatilVarMi ? prev.tatilMesai : ''
                                    }))}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                        formData.tatilVarMi 
                                            ? 'bg-indigo-600' 
                                            : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                                >
                                    <span className="sr-only">
                                        {formData.tatilVarMi 
                                            ? 'Resmi tatil çalışmasını kaldır' 
                                            : 'Resmi tatil çalışması ekle'}
                                    </span>
                                    <span
                                        className={`${
                                            formData.tatilVarMi ? 'translate-x-8' : 'translate-x-1'
                                        } inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Tatil Mesai */}
                        {formData.tatilVarMi && (
                            <div className="animate-slide-in-fast" style={{ ['--animation-order' as any]: 5 }}>
                                <div className="max-w-full">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {translations.form.holidayWork.hours.label}
                                        <div className="inline-block ml-1 group relative">
                                            <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="hidden group-hover:block absolute z-50 w-64 p-2 mt-1 text-sm text-white bg-slate-800 rounded-lg shadow-lg">
                                                {translations.form.holidayWork.hours.tooltip}
                                            </div>
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-slate-500 dark:text-slate-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="number"
                                            name="tatilMesai"
                                            value={formData.tatilMesai}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.5"
                                            placeholder="Resmi tatil mesai saati"
                                            className="block w-full pl-10 pr-4 py-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hesapla ve Kaydet Butonları */}
                        <div className="grid grid-cols-2 gap-4 pt-4 animate-slide-in" style={{ ['--animation-order' as any]: 6 }}>
                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {translations.buttons.calculate}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowSaveModal(true)}
                                className="w-full py-3 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {translations.buttons.save}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sonuçlar Modal */}
            {showModal && sonuclar && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                            {translations.results.title}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {translations.months[formData.ay as keyof typeof translations.months]} {formData.yil}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (showFromHistory) {
                                                    setShowModal(false)
                                                    setShowHistoryModal(true)
                                                    setShowFromHistory(false)
                                                } else {
                                                    setShowModal(false)
                                                }
                                            }}
                                            className="inline-flex justify-center items-center rounded-lg p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {/* Giriş Bilgileri */}
                                <div className="grid grid-cols-3 gap-4 p-4 mb-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.baseSalary}</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatPara(Number(formData.tabanMaas))}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.totalWork}</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{formData.toplamCalisma} {translations.results.hours}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.hourlyRate}</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatPara(sonuclar.saatlikUcret)}</p>
                                    </div>
                                </div>

                                {/* Hesaplama Sonuçları */}
                                <div className="grid grid-cols-2 gap-6 h-full">
                                    {/* Sol Kolon - Mesai Detayları */}
                                    <div className="flex flex-col gap-4">
                                        {sonuclar.normalMesai >= 0 ? (
                                            // Fazla mesai durumu (mevcut görünüm)
                                            <>
                                                <div className="flex-1 p-4 bg-white dark:bg-slate-700/30 rounded-xl">
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.normalOvertime}</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-xl font-semibold text-slate-900 dark:text-white">{formatSaat(sonuclar.normalMesai)}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.hours}</p>
                                                    </div>
                                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">{formatPara(sonuclar.normalMesaiUcret)}</p>
                                                </div>
                                                <div className="flex-1 p-4 bg-white dark:bg-slate-700/30 rounded-xl">
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.holidayOvertime}</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-xl font-semibold text-slate-900 dark:text-white">{formatSaat(sonuclar.tatilMesai)}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.hours}</p>
                                                    </div>
                                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">{formatPara(sonuclar.tatilMesaiUcret)}</p>
                                                </div>
                                            </>
                                        ) : (
                                            // Eksik çalışma durumu
                                            <>
                                                <div className="flex-1 p-4 bg-white dark:bg-slate-700/30 rounded-xl border border-amber-200 dark:border-amber-800">
                                                    <p className="text-sm text-amber-600 dark:text-amber-400">{translations.results.totalDeduction}</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">{formatSaat(Math.abs(sonuclar.normalMesai))}</p>
                                                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">{translations.results.hours}</p>
                                                    </div>
                                                    <p className="text-sm text-amber-600/90 dark:text-amber-400/90 mt-1">
                                                        {formatPara(Math.abs(sonuclar.normalMesai) * sonuclar.saatlikUcret)}
                                                    </p>
                                                </div>
                                                {sonuclar.tatilMesai > 0 && (
                                                    <div className="flex-1 p-4 bg-white dark:bg-slate-700/30 rounded-xl">
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.holidayOvertimePay}</p>
                                                        <div className="flex items-baseline gap-1">
                                                            <p className="text-xl font-semibold text-slate-900 dark:text-white">{formatSaat(sonuclar.tatilMesai)}</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.hours}</p>
                                                        </div>
                                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">{formatPara(sonuclar.tatilMesaiUcret)}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Sağ Kolon - Toplam Tutarlar */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex-1 p-4 bg-white dark:bg-slate-700/30 rounded-xl">
                                            {sonuclar.normalMesai >= 0 ? (
                                                <>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.totalOvertimePay}</p>
                                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{formatPara(sonuclar.toplamMesaiUcret)}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-amber-600 dark:text-amber-400">{translations.results.totalDeduction}</p>
                                                    <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">
                                                        {formatPara(Math.abs(sonuclar.normalMesai) * sonuclar.saatlikUcret)}
                                                    </p>
                                                    {sonuclar.tatilMesai > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{translations.results.holidayOvertimePay}</p>
                                                            <p className="text-lg font-medium text-slate-900 dark:text-white">{formatPara(sonuclar.tatilMesaiUcret)}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="flex-[2] p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex flex-col">
                                            <div>
                                                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{translations.results.netSalary}</p>
                                                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-3">
                                                    {formatPara(sonuclar.netMaas)}
                                                </p>
                                            </div>
                                            <div className="mt-auto pt-6 border-t border-indigo-100 dark:border-indigo-800">
                                                <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">
                                                    {sonuclar.normalMesai >= 0 
                                                        ? translations.results.calculation.withOvertime
                                                        : translations.results.calculation.withDeduction + (sonuclar.tatilMesai > 0 ? ' + ' + translations.results.calculation.withHoliday : '')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Kaydetme Modalı */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {translations.history.empty}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowSaveModal(false)}
                                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {calculationHistory.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 dark:text-slate-400">{translations.history.empty}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                        {calculationHistory.map((item, index) => (
                                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {item.date}
                                                        </p>
                                                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                                                            {formatPara(item.sonuclar.netMaas)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteHistoryCalculation(index)}
                                                            className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            title="Hesaplamayı Sil"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(item.formData)
                                                                setShowHistoryModal(false)
                                                            }}
                                                            className="px-3 py-1 text-sm bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-600"
                                                        >
                                                            Yeniden Hesapla
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(item.formData)
                                                                setSonuclar(item.sonuclar)
                                                                setShowHistoryModal(false)
                                                                setShowFromHistory(true)
                                                                setShowModal(true)
                                                            }}
                                                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                        >
                                                            Detayları Göster
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-slate-500 dark:text-slate-400">{translations.results.baseSalary}</p>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {formatPara(Number(item.formData.tabanMaas))}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 dark:text-slate-400">{translations.history.period}</p>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {translations.months[item.formData.ay as keyof typeof translations.months]} {item.formData.yil}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 dark:text-slate-400">{translations.results.totalWork}</p>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {item.formData.toplamCalisma} {translations.results.hours}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hata Toast */}
            {error && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Geçmiş Hesaplamalar Modalı */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                    {translations.history.title}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowHistoryModal(false)}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {calculationHistory.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 dark:text-slate-400">{translations.history.empty}</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                    {calculationHistory.map((item, index) => (
                                        <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {item.date}
                                                    </p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                                                        {formatPara(item.sonuclar.netMaas)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteHistoryCalculation(index)}
                                                        className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Hesaplamayı Sil"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(item.formData)
                                                            setShowHistoryModal(false)
                                                        }}
                                                        className="px-3 py-1 text-sm bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-600"
                                                    >
                                                        Yeniden Hesapla
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(item.formData)
                                                            setSonuclar(item.sonuclar)
                                                            setShowHistoryModal(false)
                                                            setShowFromHistory(true)
                                                            setShowModal(true)
                                                        }}
                                                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                    >
                                                        Detayları Göster
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-slate-500 dark:text-slate-400">{translations.results.baseSalary}</p>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {formatPara(Number(item.formData.tabanMaas))}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 dark:text-slate-400">{translations.history.period}</p>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {translations.months[item.formData.ay as keyof typeof translations.months]} {item.formData.yil}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 dark:text-slate-400">{translations.results.totalWork}</p>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {item.formData.toplamCalisma} {translations.results.hours}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 