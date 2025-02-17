import React from 'react'
import { formatPara } from '@/lib/utils/calculations'

interface SalaryInputSectionProps {
    formData: {
        tabanMaas: string
        gunlukCalismaSaati: string
    }
    translations: any
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SalaryInputSection({ formData, translations, handleInputChange }: SalaryInputSectionProps) {
    return (
        <div className="animate-slide-in" style={{ ['--animation-order' as any]: 1 }}>
            <div className="flex items-center gap-2">
                <div className="flex-1">
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
                <div className="w-48">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {translations.form.dailyWorkHours.label}
                        <div className="inline-block ml-1 group relative">
                            <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="hidden group-hover:block absolute z-50 w-64 p-2 mt-1 text-sm text-white bg-slate-800 rounded-lg shadow-lg">
                                {translations.form.dailyWorkHours.tooltip}
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
                            name="gunlukCalismaSaati"
                            value={formData.gunlukCalismaSaati}
                            onChange={handleInputChange}
                            min="1"
                            max="24"
                            step="0.5"
                            placeholder={translations.form.dailyWorkHours.placeholder}
                            className="block w-full pl-10 pr-4 py-2.5 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 