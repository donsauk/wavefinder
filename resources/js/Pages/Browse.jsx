import React from 'react'
import { Head, Link, router } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import FilterBar from '../Components/FilterBar'
import Pagination from '../Components/Pagination'
import StationCard from '../Components/StationCard'

export default function Browse({ stations }) {
    return (
        <>
            <Head title="Browse - WAVEFINDER" />
            <div className="min-h-screen bg-base-100 flex flex-col">
                <Navbar />
                <FilterBar />
                
                <div className="flex-1 pb-20">
                    <div className="max-w-8xl mx-auto p-6">
                        {/* Station Grid */}
                        <div className="grid grid-cols-6 gap-4">
                            {stations.data.map((station) => (
                                <StationCard key={station.stationuuid} station={station} />
                            ))}
                        </div>
                        
                        {/* Pagination directly below stations */}
                        <div className="mt-8">
                            <Pagination data={stations} itemName="stations" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}