'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')

    useEffect(() => {
        // Kayıtlı temayı kontrol et
        const savedTheme = localStorage.getItem('theme') as Theme | null
        
        // Kayıtlı tema varsa onu, yoksa dark tema kullan
        setTheme(savedTheme || 'dark')
    }, [])

    useEffect(() => {
        // Tema değiştiğinde HTML elementine class ekle/çıkar
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        
        // Temayı kaydet
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
} 