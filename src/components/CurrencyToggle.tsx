'use client'

import { useCurrency } from './providers/currency-provider'
import { useLanguage } from './providers/language-provider'

export default function CurrencyToggle() {
    const { currency, setCurrency } = useCurrency()
    const { translations } = useLanguage()

    return (
        <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'TRY' | 'USD' | 'EUR')}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
        >
            <option value="TRY">₺ TRY</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
        </select>
    )
} 