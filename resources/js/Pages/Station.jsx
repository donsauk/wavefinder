import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faHandPointer, faFire } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Components/Navbar'
import StationComments from '../Components/StationComments'
import StationHeader from '../Components/StationHeader'
import StationChat from '../Components/StationChat'
import FlashMessage from '../Components/FlashMessage'
// XPStats no longer used here; replaced with compact level strip


export default function Station({ station, isFavorited, canVote, nextVoteTime, comments, userXP }) {
    
    return (
        <>
            <Head title={`${station.name} - WAVEFINDER`} />
            <FlashMessage />
            <div className="min-h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Main content area - Station content takes available space, with bottom padding for audio player */}
                <div className="flex-1 pb-20">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* Back button - Using global route() function */}
                        <div className="mb-6">
                            <Link href={route('browse')} className="btn btn-ghost btn-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Browse
                            </Link>
                        </div>

                        {/* Main Layout Grid */}
                        <div className="lg:pr-96">
                            {/* Content */}
                            <div className="space-y-8">
                                {/* Hero Header */}
                                <div className="hero rounded-box bg-base-200 relative overflow-hidden shadow-xl">
                                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
                                    <div className="hero-content py-10">
                                        <StationHeader 
                                            station={station} 
                                            isFavorited={isFavorited} 
                                            canVote={canVote} 
                                            nextVoteTime={nextVoteTime} 
                                        />
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="card bg-base-200 shadow-lg">
                                    <div className="card-body">
                                        <div className="stats stats-vertical md:stats-horizontal w-full">
                                            <div className="stat">
                                                <div className="stat-title">Votes</div>
                                                <div className="stat-value text-primary flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faThumbsUp} /> {station.votes}
                                                </div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-title">Clicks</div>
                                                <div className="stat-value text-secondary flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faHandPointer} /> {station.clickcount}
                                                </div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-title">Trend</div>
                                                <div className="stat-value text-accent flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faFire} /> {station.clicktrend}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags Bar */}
                                {station.tags && (
                                    <div className="overflow-x-auto -mx-2">
                                        <div className="flex items-center gap-2 px-2 py-2 whitespace-nowrap">
                                            {station.tags.split(',').map((raw, index) => {
                                                const t = raw.trim();
                                                if (!t) return null;
                                                return (
                                                    <Link
                                                        key={`${t}-${index}`}
                                                        href={`${route('browse')}?search=${encodeURIComponent(t)}`}
                                                        className="badge badge-ghost hover:badge-primary cursor-pointer"
                                                    >
                                                        {t}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Level Strip */}
                                {userXP && (
                                    <div className="bg-base-200 rounded-box shadow p-3 flex items-center gap-4">
                                        <div className="font-semibold">Level {userXP.level || 1}</div>
                                        <progress
                                            className="progress progress-primary flex-1"
                                            value={userXP.progressPercent || 0}
                                            max="100"
                                        />
                                        <div className="badge badge-primary">{(userXP.xp || 0).toLocaleString()} XP</div>
                                    </div>
                                )}

                                {/* Details Area */}
                                <div className="grid lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-12">
                                        <div className="card bg-base-200 shadow-lg">
                                            <div className="card-body">
                                                <h2 className="card-title text-lg">Details</h2>
                                                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                                                    {station.codec && (
                                                        <div className="flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                            <span className="opacity-70">Codec</span>
                                                            <span className="font-semibold">{station.codec}</span>
                                                        </div>
                                                    )}
                                                    {station.bitrate && (
                                                        <div className="flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                            <span className="opacity-70">Bitrate</span>
                                                            <span className="font-semibold">{station.bitrate} kbps</span>
                                                        </div>
                                                    )}
                                                    {station.language && (
                                                        <div className="flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                            <span className="opacity-70">Language</span>
                                                            <span className="font-semibold lowercase">{station.language}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                        <span className="opacity-70">HLS</span>
                                                        <span className={`badge ${station.hls ? 'badge-success' : 'badge-outline'}`}>{station.hls ? 'Yes' : 'No'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                        <span className="opacity-70">SSL</span>
                                                        <span className={`badge ${station.ssl_error ? 'badge-error' : 'badge-success'}`}>{station.ssl_error ? 'Error' : 'OK'}</span>
                                                    </div>
                                                    {station.homepage && (
                                                        <div className="sm:col-span-2 flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                            <span className="opacity-70">Homepage</span>
                                                            <a 
                                                                href={station.homepage}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                                Visit Homepage
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments */}
                                <div className="mt-2">
                                    <StationComments stationUuid={station.stationuuid} comments={comments} />
                                </div>
                            </div>

                            {/* Right Sidebar - Chat */}
                            <div className="hidden lg:block">
                                <div className="fixed top-16 right-0 w-96 h-[calc(100vh-9rem)] z-30">
                                    <StationChat stationUuid={station.stationuuid} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
