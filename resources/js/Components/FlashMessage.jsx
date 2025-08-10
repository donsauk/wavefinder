import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'

export default function FlashMessage() {
    const { flash } = usePage().props
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (flash?.message) {
            setVisible(true)
            // Auto hide after 5 seconds
            const timer = setTimeout(() => {
                setVisible(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [flash?.message])

    if (!flash?.message || !visible) return null

    return (
        <div className="toast toast-top toast-center z-50">
            <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{flash.message}</span>
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