import React from 'react'
import { Head, Link, router } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import FilterBar from '../Components/FilterBar'
import Footer from '../Components/Footer'
import Pagination from '../Components/Pagination'

export default function Browse({ stations }) {
    // Handle station click - tracks click and navigates to station page
    const handleStationClick = async (stationuuid) => {
        try {
            // Track the click with radio-browser API
            await fetch(`/station/${stationuuid}/click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
        } catch (error) {
            // Silently fail - don't let API issues affect navigation
            console.warn('Failed to track station click:', error);
        }
        
        // Navigate to station page
        router.get(`/station/${stationuuid}`);
    };

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
                                        {/* Station Icon - Larger with hover play overlay */}
                                        <div className="flex justify-center my-2">
                                            <div 
                                                className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:ring-4 hover:ring-secondary hover:ring-opacity-80"
                                                onClick={() => handleStationClick(station.stationuuid)}
                                            >
                                                {station.favicon ? (
                                                    <img 
                                                        src={station.favicon} 
                                                        alt=""
                                                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : null}
                                                
                                                {/* Fallback letter - only show when no favicon or favicon failed to load */}
                                                <span className="transition-opacity duration-300 group-hover:opacity-70 absolute inset-0 flex items-center justify-center text-2xl">
                                                    {(!station.favicon) ? (station.name?.charAt(0).toUpperCase() || '?') : ''}
                                                </span>
                                                
                                                {/* Hover Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 5v10l7-5-7-5z"/>
                                                    </svg>
                                                </div>
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
                                            <span>🔥 {station.clicktrend}</span>
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