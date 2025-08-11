import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (flash?.message || flash?.error) {
            setVisible(true)
            // Auto hide after 5 seconds
            const timer = setTimeout(() => {
                setVisible(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [flash?.message, flash?.error])

    if ((!flash?.message && !flash?.error) || !visible) return null

    const isError = flash?.error
    const message = flash?.error || flash?.message

    return (
        <div className="toast toast-top toast-center z-50">
            <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    {isError ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                </svg>
                <span>{message}</span>
                <button 
                    onClick={() => setVisible(false)}
                    className="btn btn-sm btn-circle btn-ghost"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}