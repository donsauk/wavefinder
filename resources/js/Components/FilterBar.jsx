import React from 'react'
import { router, usePage, useRemember } from '@inertiajs/react'

export default function FilterBar() {
    // Get props from Laravel backend via Inertia.js
    const { countries, filters, auth } = usePage().props
    
    // Use useRemember for persistent filter state across navigation
    const [filterState, setFilterState] = useRemember({
        searchQuery: filters?.search || '',
        sortBy: filters?.sort_by || 'votes',
        sortDirection: filters?.sort_direction || 'desc',
        showFavoritesOnly: filters?.favorites_only || false,
        country: filters?.country || 'all'
    }, 'BrowseFilters')
    
    // Helper function to update filter state and navigate
    const updateFilters = (newFilters) => {
        const updatedState = { ...filterState, ...newFilters }
        setFilterState(updatedState)
        
        // Use global route() function for consistent routing
        router.get(route('browse'), {
            country: updatedState.country,
            search: updatedState.searchQuery,
            sort_by: updatedState.sortBy,
            sort_direction: updatedState.sortDirection,
            favorites_only: updatedState.showFavoritesOnly
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true // Replace URL instead of adding to history for filters
        })
    }
    
    // Handle country dropdown change
    const handleCountryChange = (e) => {
        updateFilters({ country: e.target.value })
    }

    // Handle search form submission (Enter key press)
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        updateFilters({ searchQuery: filterState.searchQuery })
    }

    // Handle sort field change (votes, clickcount, clicktrend)
    const handleSortChange = (e) => {
        updateFilters({ sortBy: e.target.value })
    }

    // Handle sort direction toggle (asc/desc)
    const handleSortDirectionToggle = () => {
        const newDirection = filterState.sortDirection === 'desc' ? 'asc' : 'desc'
        updateFilters({ sortDirection: newDirection })
    }

    // Handle favorites filter toggle - only show if user is authenticated
    const handleFavoritesToggle = () => {
        updateFilters({ showFavoritesOnly: !filterState.showFavoritesOnly })
    }

    // Update local search state as user types
    const handleSearchChange = (e) => {
        setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))
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
                                value={filterState.searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </form>

                    {/* Country Filter */}
                    <div className="form-control">
                        <select 
                            className="select select-bordered select-sm w-48"
                            value={filterState.country}
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
                                value={filterState.sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="votes">Votes</option>
                                <option value="clickcount">Clicks</option>
                                <option value="clicktrend">Trending</option>
                            </select>
                            <button
                                type="button"
                                className="btn btn-secondary ml-2 btn-sm w-10"
                                onClick={handleSortDirectionToggle}
                                title={filterState.sortDirection === 'desc' ? 'Descending' : 'Ascending'}
                            >
                                {filterState.sortDirection === 'desc' ? '↓' : '↑'}
                            </button>
                        </div>
                    </div>

                    {/* Favorites Filter - only show if user is authenticated */}
                    {auth?.user && (
                        <div className="form-control">
                            <button
                                type="button"
                                className={`btn btn-sm ${filterState.showFavoritesOnly ? 'btn-primary' : 'btn-outline btn-primary'}`}
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