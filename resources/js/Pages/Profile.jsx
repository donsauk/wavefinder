import React from 'react'
import { Head } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import ListeningStats from '../Components/ListeningStats'

export default function Profile({ user }) {
    return (
        <>
            <Head title="Profile - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                <Navbar />

                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                        {/* User Profile Card */}
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
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-3xl font-bold">{user.name}</h1>
                                            <div className="badge badge-primary badge-lg">
                                                Level {user.level || 1}
                                            </div>
                                        </div>
                                        <p className="text-base-content/70">{user.email}</p>
                                        <p className="text-sm text-base-content/50">
                                            Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        
                                        {/* XP Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-base-content/70 mb-1">
                                                {(user.level || 1) < 99 && (
                                                    <span>{user.xp_to_next_level || 0} XP to level {(user.level || 1) + 1}</span>
                                                )}
                                            </div>
                                            {(user.level || 1) < 99 ? (
                                                <progress 
                                                    className="progress progress-primary w-full" 
                                                    value={user.xp_progress_percent || 0} 
                                                    max="100"
                                                ></progress>
                                            ) : (
                                                <div className="badge badge-accent">Max Level!</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Listening Stats Card */}
                        <ListeningStats />
                    </div>
                </div>
            </div>
        </>
    )
}