import React from 'react'
import { hesaplaMinimumCalisma } from '@/lib/utils/calculations'

interface PeriodSelectionProps {
    formData: {
        ay: string
        yil: string
        gunlukCalismaSaati: string
    }
    translations: any
    handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function PeriodSelection({ formData, translations, handleInputChange }: PeriodSelectionProps) {
    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

    const aylar = [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "4" },
        { value: "5" },
        { value: "6" },
        { value: "7" },
        { value: "8" },
        { value: "9" },
        { value: "10" },
        { value: "11" },
        { value: "12" }
    ]

    return (
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
    )
} 