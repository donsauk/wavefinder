import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faHandPointer, faFire, faGlobe } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Components/Navbar'
import StationComments from '../Components/StationComments'
import StationHeader from '../Components/StationHeader'
import StationChat from '../Components/StationChat'
import FlashMessage from '../Components/FlashMessage'
// XPStats no longer used here; replaced with compact level strip


export default function Station({ station, isFavorited, canVote, nextVoteTime, comments, userXP }) {
    const homepageDomain = (() => {
        try {
            return station?.homepage ? new URL(station.homepage).hostname.replace(/^www\./, '') : ''
        } catch (e) {
            return ''
        }
    })()
    const languageLabel = (() => {
        if (!station?.language) return ''
        const s = String(station.language).trim()
        if (!s) return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    })()
    
    return (
        <>
            <Head title={`${station.name} - WAVEFINDER`} />
            <FlashMessage />
            <div className="h-screen overflow-hidden bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Main content area - Station content takes available space, with bottom padding for audio player */}
                <div className="flex-1 overflow-y-auto pb-20">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* Back button integrated into hero card (removed standalone block) */}

                        {/* Main Layout Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6">
                            {/* Content */}
                            <div className="space-y-8">
                                {/* Hero Header */}
                                <div className="hero rounded-box bg-base-200 relative overflow-hidden shadow-xl">
                                    {/* Inline Back button inside the card */}
                                    <Link href={route('browse')} className="btn btn-primary btn-sm absolute left-4 top-4 z-10">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to Browse
                                    </Link>
                                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
                                    <div className="hero-content py-8">
                                        <StationHeader 
                                            station={station} 
                                            isFavorited={isFavorited} 
                                            canVote={canVote} 
                                            nextVoteTime={nextVoteTime} 
                                        />
                                    </div>
                                </div>

                                {/* Compact Info Panel: Stats + Tags + Details */}
                                <div className="card bg-base-200 shadow-lg">
                                    <div className="card-body gap-4">
                                        {/* Stats Row (unchanged design) */}
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

                                        {/* Tags Row */}
                                        {station.tags && (
                                            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                                                {station.tags.split(',').map((raw, index) => {
                                                    const t = raw.trim();
                                                    if (!t) return null;
                                                    return (
                                                        <Link
                                                            key={`${t}-${index}`}
                                                            href={`${route('browse')}?search=${encodeURIComponent(t)}`}
                                                            className="badge badge-primary badge-sm"
                                                        >
                                                            {t}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Details Row (no HLS/SSL) */}
                                        <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3">
                                            {station.codec && (
                                                <div className="flex-1 flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                    <span className="opacity-70">Codec</span>
                                                    <span className="font-semibold">{station.codec}</span>
                                                </div>
                                            )}
                                            {station.bitrate && (
                                                <div className="flex-1 flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                    <span className="opacity-70">Bitrate</span>
                                                    <span className="font-semibold">{station.bitrate} kbps</span>
                                                </div>
                                            )}
                                            {languageLabel && (
                                                <div className="flex-1 flex items-center justify-between p-2 rounded-box bg-base-100 border border-base-300">
                                                    <span className="opacity-70">Language</span>
                                                    <span className="font-semibold">{languageLabel}</span>
                                                </div>
                                            )}
                                            {station.homepage && (
                                                <a
                                                    href={station.homepage}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-2 p-2 rounded-box border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-full sm:w-auto shadow-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    <span className="font-medium truncate max-w-[14rem]">
                                                        {homepageDomain || 'Visit Homepage'}
                                                    </span>
                                                    <svg className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

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

                                {/* (Old separate details/tags/stats removed in favor of compact panel above) */}

                                {/* Comments */}
                                <div className="mt-2">
                                    <StationComments stationUuid={station.stationuuid} comments={comments} />
                                </div>
                            </div>

                            {/* Right Sidebar - Chat (inline with content) */}
                            <div className="hidden lg:block">
                                <div className="sticky h-[calc(100vh-15rem)]">
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
