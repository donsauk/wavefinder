import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function FilterBar() {
    // Get props from Laravel backend via Inertia.js
    const { countries, filters } = usePage().props
    
    // Initialize search state from backend filters to preserve search across page loads
    const [searchQuery, setSearchQuery] = useState(filters?.search || '')
    
    // Initialize sort state from backend filters - default to votes descending
    const [sortBy, setSortBy] = useState(filters?.sort_by || 'votes')
    const [sortDirection, setSortDirection] = useState(filters?.sort_direction || 'desc')
    
    // Handle country dropdown change - preserves all other filters
    const handleCountryChange = (e) => {
        // Send Inertia request to /browse with all current filters preserved
        router.get('/browse', { 
            country: e.target.value, 
            search: searchQuery,
            sort_by: sortBy,
            sort_direction: sortDirection
        }, {
            preserveState: true,    // Keep component state intact
            preserveScroll: true,   // Maintain scroll position
        })
    }

    // Handle search form submission (Enter key press)
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        // Send Inertia request to /browse with all current filters preserved
        router.get('/browse', { 
            country: filters?.country || 'all',
            search: searchQuery,
            sort_by: sortBy,
            sort_direction: sortDirection
        }, {
            preserveState: true,    // Keep component state intact
            preserveScroll: true,   // Maintain scroll position
        })
    }

    // Handle sort field change (votes, clickcount, clicktrend)
    const handleSortChange = (e) => {
        const newSortBy = e.target.value
        setSortBy(newSortBy)
        // Send Inertia request with new sort field
        router.get('/browse', {
            country: filters?.country || 'all',
            search: searchQuery,
            sort_by: newSortBy,
            sort_direction: sortDirection
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    // Handle sort direction toggle (asc/desc)
    const handleSortDirectionToggle = () => {
        const newDirection = sortDirection === 'desc' ? 'asc' : 'desc'
        setSortDirection(newDirection)
        // Send Inertia request with new sort direction
        router.get('/browse', {
            country: filters?.country || 'all',
            search: searchQuery,
            sort_by: sortBy,
            sort_direction: newDirection
        }, {
            preserveState: true,
            preserveScroll: true,
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

                    {/* Sort Options */}
                    <div className="form-control">
                        <div className="flex gap-1">
                            <select 
                                className="select select-bordered select-sm w-32"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="votes">Votes</option>
                                <option value="clickcount">Clicks</option>
                                <option value="clicktrend">Trending</option>
                            </select>
                            <button
                                type="button"
                                className="btn btn-secondary btn-bordered ml-2 btn-sm w-10"
                                onClick={handleSortDirectionToggle}
                                title={sortDirection === 'desc' ? 'Descending' : 'Ascending'}
                            >
                                {sortDirection === 'desc' ? '↓' : '↑'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}