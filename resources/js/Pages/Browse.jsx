import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import FilterBar from '../Components/FilterBar'
import Footer from '../Components/Footer'
import Pagination from '../Components/Pagination'

export default function Browse({ stations }) {
    return (
        <>
            <Head title="Browse - WAVEFINDER" />
            <div className="h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Filter Bar - Fixed height */}
                <FilterBar />

                {/* Main content area - Takes remaining space */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="max-w-8xl mx-auto p-6">
                        {/* Station Grid - 2 rows, larger cards */}
                        <div className="grid grid-cols-6 gap-4">
                            {stations.data.map((station) => (
                                <div 
                                    key={station.stationuuid} 
                                    className="card bg-base-200"
                                >
                                    <div className="card-body p-2 flex flex-col h-full">
                                        {/* Station Icon - Larger */}
                                        <div className="flex justify-center my-2">
                                            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl overflow-hidden">
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

                                        {/* Station Name - Bigger text */}
                                        <div className="h-14 flex items-center justify-center px-2">
                                            <h3 className="font-semibold text-base text-center line-clamp-2" title={station.name}>
                                                {station.name || 'Unknown Station'}
                                            </h3>
                                        </div>

                                        {/* Badges - Bigger */}
                                        <div className="h-6 flex justify-center items-center gap-1">
                                            {station.countrycode && (
                                                <span className="badge badge-outline badge-sm">
                                                    {station.countrycode}
                                                </span>
                                            )}
                                        </div>

                                        {/* Stats - Bigger */}
                                        <div className="h-5 flex justify-center items-center gap-3 text-sm opacity-60">
                                            <span>👍 {station.votes}</span>
                                            <span>👆 {station.clickcount}</span>
                                        </div>

                                        {/* Play Button - Bigger */}
                                        <div className="flex justify-center mt-2">
                                            <button className="btn btn-primary btn-lg btn-circle">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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

                {/* Pagination - Fixed height */}
                <Pagination data={stations} itemName="stations" />

                {/* Footer - Fixed height */}
                <Footer />
            </div>
        </>
    )
}