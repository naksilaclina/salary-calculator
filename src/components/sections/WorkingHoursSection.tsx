import React from 'react'
import { formatSaat, hesaplaMinimumCalisma } from '@/lib/utils/calculations'

interface WorkingHoursSectionProps {
    formData: {
        toplamCalisma: string
        ay: string
        yil: string
        gunlukCalismaSaati: string
    }
    translations: any
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function WorkingHoursSection({ formData, translations, handleInputChange }: WorkingHoursSectionProps) {
    return (
        <div className="animate-slide-in" style={{ ['--animation-order' as any]: 5 }}>
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
                                const minCalisma = hesaplaMinimumCalisma(Number(formData.yil), Number(formData.ay), Number(formData.gunlukCalismaSaati))
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
                                                    </p>
                                                ) : (
                                                    <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
                                                        <span className="font-medium">{formatSaat(minCalisma - Number(formData.toplamCalisma))} saat</span> eksik çalışmanız var
                                                        <br />
                                                        Eksik çalışma kesintisi: <span className="font-medium">x1.0</span> (normal saatlik ücret)
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
    )
} 