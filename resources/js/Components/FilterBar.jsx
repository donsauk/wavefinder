import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function FilterBar() {
    // Get props from Laravel backend via Inertia.js
    const { countries, filters } = usePage().props
    
    // Initialize search state from backend filters to preserve search across page loads
    const [searchQuery, setSearchQuery] = useState(filters?.search || '')
    
    // Handle country dropdown change - preserves current search query
    const handleCountryChange = (e) => {
        // Send Inertia request to /browse with both country and search filters
        router.get('/browse', { 
            country: e.target.value, 
            search: searchQuery 
        }, {
            preserveState: true,    // Keep component state intact
            preserveScroll: true,   // Maintain scroll position
        })
    }

    // Handle search form submission (Enter key press)
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        // Send Inertia request to /browse with both search and country filters
        router.get('/browse', { 
            country: filters?.country || 'all',
            search: searchQuery 
        }, {
            preserveState: true,    // Keep component state intact
            preserveScroll: true,   // Maintain scroll position
        })
    }

    // Update local search state as user types
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }
    return (
        <div className="bg-base-200 border-b border-base-300 h-14 flex-shrink-0">
            <div className="max-w-8xl mx-auto px-8 h-full">
                <div className="flex items-center justify-center gap-4 h-full">
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="form-control">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input
                                type="search"
                                className="input input-bordered input-sm w-64 pl-10"
                                placeholder="Search stations..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </form>

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