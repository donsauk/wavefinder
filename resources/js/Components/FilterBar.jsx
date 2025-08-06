import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function FilterBar() {
    // Get props from Laravel backend via Inertia.js
    const { countries, filters, auth } = usePage().props
    
    // Initialize search state from backend filters to preserve search across page loads
    const [searchQuery, setSearchQuery] = useState(filters?.search || '')

    // Initialize sort state from backend filters - default to votes descending
    const [sortBy, setSortBy] = useState(filters?.sort_by || 'votes')
    const [sortDirection, setSortDirection] = useState(filters?.sort_direction || 'desc')
    
    // Initialize favorites filter state from backend filters
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(filters?.favorites_only || false)
    
    // Handle country dropdown change - preserves all other filters
    const handleCountryChange = (e) => {
        // Send Inertia request to /browse with all current filters preserved
        router.get('/browse', { 
            country: e.target.value, 
            search: searchQuery,
            sort_by: sortBy,
            sort_direction: sortDirection,
            favorites_only: showFavoritesOnly
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
            sort_direction: sortDirection,
            favorites_only: showFavoritesOnly
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
            sort_direction: sortDirection,
            favorites_only: showFavoritesOnly
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
            sort_direction: newDirection,
            favorites_only: showFavoritesOnly
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    // Handle favorites filter toggle - only show if user is authenticated
    const handleFavoritesToggle = () => {
        const newShowFavorites = !showFavoritesOnly
        setShowFavoritesOnly(newShowFavorites)
        // Send Inertia request with new favorites filter
        router.get('/browse', {
            country: filters?.country || 'all',
            search: searchQuery,
            sort_by: sortBy,
            sort_direction: sortDirection,
            favorites_only: newShowFavorites
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
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                <span className="text-base-content opacity-70 text-base">🔍</span>
                            </div>
                            <input
                                type="search"
                                className="input input-bordered input-sm w-64 pl-10 relative z-0"
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

                    {/* Favorites Filter - only show if user is authenticated */}
                    {auth?.user && (
                        <div className="form-control">
                            <button
                                type="button"
                                className={`btn btn-sm ${showFavoritesOnly ? 'btn-primary' : 'btn-outline btn-primary'}`}
                                onClick={handleFavoritesToggle}
                                title="Show favorites only"
                            >
                                ❤️ Favorites
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}