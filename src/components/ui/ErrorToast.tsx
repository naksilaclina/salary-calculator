import React from 'react'

interface ErrorToastProps {
    error: string | null
}

export default function ErrorToast({ error }: ErrorToastProps) {
    if (!error) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
                <p className="text-sm">{error}</p>
            </div>
        </div>
    )
}