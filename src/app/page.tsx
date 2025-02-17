import React from 'react'
import SalaryCalculatorForm from '@/components/SalaryCalculatorForm'
import { ThemeProvider } from '@/components/providers/theme-provider'

export default function Home() {
    return (
        <ThemeProvider>
            <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
                <SalaryCalculatorForm />
            </main>
        </ThemeProvider>
    )
}
