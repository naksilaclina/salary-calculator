import React from 'react'

interface FormState {
    tabanMaas: string
    ay: string
    yil: string
    toplamCalisma: string
    tatilVarMi: boolean
    tatilMesai: string
    gunlukCalismaSaati: string
}

interface HolidayWorkSectionProps {
    formData: {
        tatilVarMi: boolean
        tatilMesai: string
    }
    translations: any
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setFormData: React.Dispatch<React.SetStateAction<FormState>>
}

export default function HolidayWorkSection({ formData, translations, handleInputChange, setFormData }: HolidayWorkSectionProps) {
    return (
        <>
            <div className="animate-slide-in" style={{ ['--animation-order' as any]: 6 }}>
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
                        onClick={() => setFormData((prev: FormState) => ({
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

            {formData.tatilVarMi && (
                <div className="animate-slide-in-fast" style={{ ['--animation-order' as any]: 7 }}>
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
        </>
    )
} 