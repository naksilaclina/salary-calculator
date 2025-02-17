import React from 'react'
import { formatPara, formatSaat } from '@/lib/utils/calculations'

interface ResultsModalProps {
    showModal: boolean
    sonuclar: {
        saatlikUcret: number
        normalMesai: number
        tatilMesai: number
        normalMesaiUcret: number
        tatilMesaiUcret: number
        toplamMesaiUcret: number
        netMaas: number
    } | null
    formData: {
        ay: string
        yil: string
        tabanMaas: string
        toplamCalisma: string
    }
    translations: any
    setShowModal: (show: boolean) => void
}

export default function ResultsModal({ showModal, sonuclar, formData, translations, setShowModal }: ResultsModalProps) {
    if (!showModal || !sonuclar) return null

    return (
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
                                    onClick={() => setShowModal(false)}
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
    )
} 