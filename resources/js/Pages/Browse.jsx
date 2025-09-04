import React from 'react'
import { Head } from '@inertiajs/react'
import FilterBar from '../Components/FilterBar'
import Pagination from '../Components/Pagination'
import StationCard from '../Components/StationCard'
import AppLayout from '../Layouts/AppLayout'

export default function Browse({ stations }) {
    return (
        <>
            <Head title="Browse - WAVEFINDER" />
            <AppLayout top={<FilterBar />} containerClass="max-w-8xl mx-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {stations.data.map((station) => (
                        <StationCard key={station.stationuuid} station={station} />
                    ))}
                </div>
                <div className="mt-8">
                    <Pagination data={stations} itemName="stations" />
                </div>
            </AppLayout>
        </>
    )
}
