import React from 'react'
import { router, usePage } from '@inertiajs/react'

export default function FilterBar() {
    const { countries, filters } = usePage().props
    
    const handleCountryChange = (e) => {
        router.get('/browse', { country: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
        })
    }
    return (
        <div className="bg-base-200 border-b border-base-300 h-14 flex-shrink-0">
            <div className="max-w-8xl mx-auto px-8 h-full">
                <div className="flex items-center justify-center gap-4 h-full">
                    {/* Country Filter */}
                    <div className="form-control">
                        <select 
                            className="select select-bordered select-sm w-48"
                            value={filters?.country || 'all'}
                            onChange={handleCountryChange}
                        >
                            <option value="all">All Countries</option>
                            {countries && Object.entries(countries).map(([country, name]) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}