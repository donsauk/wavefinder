import React from 'react'
import { Head } from '@inertiajs/react'
import Navbar from '../Components/Navbar'

export default function Profile({ user, stats }) {
    return (
        <>
            <Head title="Profile - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Main content area - Takes remaining space, with bottom padding for audio player */}
                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="space-y-6">
                            {/* Profile Header */}
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
                                                Joined {new Date(stats.joined_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Statistics */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">Your Statistics</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Level & XP */}
                                        <div className="stat bg-base-300 rounded-lg">
                                            <div className="stat-figure text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                </svg>
                                            </div>
                                            <div className="stat-title">Level</div>
                                            <div className="stat-value text-primary">{stats.level}</div>
                                            <div className="stat-desc">{stats.xp} XP</div>
                                        </div>

                                        {/* Stations Listened */}
                                        <div className="stat bg-base-300 rounded-lg">
                                            <div className="stat-figure text-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/>
                                                </svg>
                                            </div>
                                            <div className="stat-title">Stations Listened</div>
                                            <div className="stat-value text-secondary">{stats.stations_listened}</div>
                                            <div className="stat-desc">Coming Soon</div>
                                        </div>

                                        {/* Listening Time */}
                                        <div className="stat bg-base-300 rounded-lg">
                                            <div className="stat-figure text-accent">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                                                </svg>
                                            </div>
                                            <div className="stat-title">Listening Time</div>
                                            <div className="stat-value text-accent">{stats.listening_time}h</div>
                                            <div className="stat-desc">Coming Soon</div>
                                        </div>

                                        {/* Favorite Stations */}
                                        <div className="stat bg-base-300 rounded-lg">
                                            <div className="stat-figure text-error">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                </svg>
                                            </div>
                                            <div className="stat-title">Favorites</div>
                                            <div className="stat-value text-error">{stats.favorite_count}</div>
                                            <div className="stat-desc">Coming Soon</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Future Features Placeholder */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h2 className="card-title">Coming Soon</h2>
                                    <p className="text-base-content/70">
                                        More profile features are coming including listening history, 
                                        favorite stations, achievements, and detailed statistics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}