'use client'

import React, { createContext, useContext, useState } from 'react'

type CurrencyType = 'TRY' | 'USD' | 'EUR'

interface CurrencyContextType {
    currency: CurrencyType
    setCurrency: (currency: CurrencyType) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyType>('TRY')

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
} 