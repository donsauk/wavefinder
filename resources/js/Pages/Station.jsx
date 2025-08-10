import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import StationComments from '../Components/StationComments'
import StationHeader from '../Components/StationHeader'


export default function Station({ station, isFavorited, canVote, nextVoteTime }) {
    return (
        <>
            <Head title={`${station.name} - WAVEFINDER`} />
            <div className="min-h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Main content area - Station content takes available space, with bottom padding for audio player */}
                <div className="flex-1 pb-20">
                    <div className="max-w-4xl mx-auto p-6">
                        {/* Back button */}
                        <div className="mb-6">
                            <Link href="/browse" className="btn btn-outline btn-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Browse
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Station Header */}
                            <StationHeader 
                                station={station} 
                                isFavorited={isFavorited} 
                                canVote={canVote} 
                                nextVoteTime={nextVoteTime} 
                            />

                            {/* Station Details */}
                            <div className="space-y-6">
                                {/* Statistics */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg mb-4">Statistics</h2>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-primary flex items-center justify-center">
                                                    <span className="mr-2">👍</span>
                                                    <span className="min-w-[80px] text-right">{station.votes}</span>
                                                </div>
                                                <div className="text-sm opacity-70">Votes</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-secondary flex items-center justify-center">
                                                    <span className="mr-2">👆</span>
                                                    <span className="min-w-[80px] text-right">{station.clickcount}</span>
                                                </div>
                                                <div className="text-sm opacity-70">Clicks</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-accent flex items-center justify-center">
                                                    <span className="mr-2">🔥</span>
                                                    <span className="min-w-[80px] text-right">{station.clicktrend}</span>
                                                </div>
                                                <div className="text-sm opacity-70">Trend</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Information */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg mb-4">Technical Details</h2>
                                        <div className="space-y-3">
                                            {station.codec && (
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Codec:</span>
                                                    <span className="font-semibold">{station.codec}</span>
                                                </div>
                                            )}
                                            {station.bitrate && (
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Bitrate:</span>
                                                    <span className="font-semibold">{station.bitrate} kbps</span>
                                                </div>
                                            )}
                                            {station.language && (
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Language:</span>
                                                    <span className="font-semibold">{station.language}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="opacity-70">HLS:</span>
                                                <span className={`badge ${station.hls ? 'badge-success' : 'badge-outline'}`}>
                                                    {station.hls ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="opacity-70">SSL:</span>
                                                <span className={`badge ${station.ssl_error ? 'badge-error' : 'badge-success'}`}>
                                                    {station.ssl_error ? 'Error' : 'OK'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                {station.tags && (
                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h2 className="card-title text-lg mb-4">Tags</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {station.tags.split(',').map((tag, index) => (
                                                    <span key={index} className="badge badge-outline">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {station.homepage && (
                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h2 className="card-title text-lg mb-4">Links</h2>
                                            <a 
                                                href={station.homepage} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-outline btn-sm"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Visit Homepage
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments Section - Full width below station details */}
                        <div className="mt-8">
                            <StationComments stationUuid={station.stationuuid} />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}