import React from 'react'
import { Head } from '@inertiajs/react'
import Navbar from '../Components/Navbar'

export default function Profile({ user }) {
    return (
        <>
            <Head title="Profile - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                <Navbar />

                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <div className="flex items-center gap-6">
                                    <div className="avatar">
                                        <div className="w-24 rounded-full bg-primary">
                                            <div className="w-full h-full flex items-center justify-center text-white">
                                                <span className="text-3xl font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">{user.name}</h1>
                                        <p className="text-base-content/70">{user.email}</p>
                                        <p className="text-sm text-base-content/50">
                                            Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}