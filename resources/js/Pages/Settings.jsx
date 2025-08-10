import React from 'react'
import { Head } from '@inertiajs/react'
import Navbar from '../Components/Navbar'

export default function Settings() {
    return (
        <>
            <Head title="Settings - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                <Navbar />

                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h1 className="text-3xl font-bold">Settings</h1>
                                <p className="text-base-content/70">Settings page coming soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}