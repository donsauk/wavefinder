import React, { useState, useEffect, useRef } from 'react'
import { usePage } from '@inertiajs/react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)
    const [isError, setIsError] = useState(false)
    const timerRef = useRef(null)

    // Capture flash once and keep it in local state so
    // it doesn't disappear when Inertia clears flash props
    useEffect(() => {
        const nextMessage = flash?.error || flash?.success || flash?.message
        if (nextMessage) {
            setMessage(nextMessage)
            setIsError(Boolean(flash?.error))
            setVisible(true)
            // reset any existing timer
            if (timerRef.current) clearTimeout(timerRef.current)
            // Auto hide after 5 seconds
            timerRef.current = setTimeout(() => setVisible(false), 5000)
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [flash?.message, flash?.success, flash?.error])

    if (!message || !visible) return null

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
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}
