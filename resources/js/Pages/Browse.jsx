import React from 'react'
import { Head, Link, router } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import FilterBar from '../Components/FilterBar'
import Pagination from '../Components/Pagination'
import StationCard from '../Components/StationCard'
import { useAudio } from '../Contexts/AudioContext'

export default function Browse({ stations }) {
    const { currentStation } = useAudio()
    const hasActivePlayer = !!currentStation

    return (
        <>
            <Head title="Browse - WAVEFINDER" />
            {/* Main page container - Use proper flexbox layout without excess padding */}
            <div className="min-h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Filter Bar - Fixed height */}
                <FilterBar />

                {/* Main content container - contains both stations and pagination */}
                <div className={`flex-1 ${hasActivePlayer ? 'pb-20' : 'pb-4'}`}>
                    {/* Station Grid Container */}
                    <div className={`${hasActivePlayer ? 'pb-16' : 'pb-4'}`}>
                        <div className="max-w-8xl mx-auto p-6">
                            {/* Station Grid - 2 rows, larger cards */}
                            <div className="grid grid-cols-6 gap-4">
                                {stations.data.map((station) => (
                                    <StationCard key={station.stationuuid} station={station} />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Pagination - positioned at bottom of content, moves up when player is active */}
                    <div className={`${hasActivePlayer ? 'fixed bottom-20 left-0 right-0 z-40' : 'sticky bottom-0'} bg-base-100`}>
                        <Pagination data={stations} itemName="stations" />
                    </div>
                </div>
            </div>
        </>
    )
}