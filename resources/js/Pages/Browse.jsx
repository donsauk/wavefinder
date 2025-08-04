import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Pagination from '../Components/Pagination'

export default function Browse({ stations }) {
    return (
        <>
            <Head title="Browse - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                {/* Content with proper padding for pagination */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-8xl mx-auto p-8">
                        {/* Station Grid */}
                        <div className="grid grid-cols-6 gap-4">
                            {stations.data.map((station) => (
                                <div 
                                    key={station.stationuuid} 
                                    className="card bg-base-200"
                                >
                                    <div className="card-body p-2 flex flex-col h-full">
                                        {/* Station Icon*/}
                                        <div className="flex justify-center my-2">
                                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl overflow-hidden">
                                                {station.favicon ? (
                                                    <img 
                                                        src={station.favicon} 
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = station.name?.charAt(0).toUpperCase() || '?';
                                                        }}
                                                    />
                                                ) : (
                                                    station.name?.charAt(0).toUpperCase() || '?'
                                                )}
                                            </div>
                                        </div>

                                        {/* Station Name */}
                                        <div className="h-12 flex items-center justify-center px-2">
                                            <h3 className="font-semibold text-sm text-center line-clamp-2" title={station.name}>
                                                {station.name || 'Unknown Station'}
                                            </h3>
                                        </div>

                                        {/* Badges */}
                                        <div className="h-5 flex justify-center items-center gap-1">
                                            {station.countrycode && (
                                                <span className="badge badge-outline badge-xs">
                                                    {station.countrycode}
                                                </span>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="h-4 flex justify-center items-center gap-3 text-xs opacity-60">
                                            <span>👍 {station.votes}</span>
                                            <span>👆 {station.clickcount}</span>
                                        </div>

                                        {/* Play Button */}
                                        <div className="flex justify-center">
                                            <button className="btn btn-primary btn-circle">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 5v10l7-5-7-5z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination Component */}
                <Pagination data={stations} itemName="stations" />
            </div>
        </>
    )
}