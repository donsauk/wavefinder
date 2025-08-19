import React from 'react'
import { router, usePage, useRemember } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faHeart, faMusic, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function FilterBar() {
    // Get props from Laravel backend via Inertia.js
    const { countries, filters, auth } = usePage().props
    
    // Use useRemember for persistent filter state across navigation
    const [filterState, setFilterState] = useRemember({
        searchQuery: filters?.search || '',
        sortBy: filters?.sort_by || 'votes',
        sortDirection: filters?.sort_direction || 'desc',
        showFavoritesOnly: filters?.favorites_only || false,
        showHistoryOnly: filters?.history_only || false,
        country: filters?.country || 'all',
        countrycode: filters?.countrycode || 'all'
    }, 'BrowseFilters')
    
    // Helper function to update filter state and navigate
    const updateFilters = (newFilters) => {
        const updatedState = { ...filterState, ...newFilters }
        setFilterState(updatedState)
        
        // Use global route() function for consistent routing
        router.get(route('browse'), {
            country: updatedState.country,
            countrycode: updatedState.countrycode,
            search: updatedState.searchQuery,
            sort_by: updatedState.sortBy,
            sort_direction: updatedState.sortDirection,
            favorites_only: updatedState.showFavoritesOnly,
            history_only: updatedState.showHistoryOnly
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

    // Handle combined sort change (field + direction)
    const handleSortChange = (e) => {
        const [sortBy, sortDirection] = e.target.value.split('-')
        updateFilters({ sortBy, sortDirection })
    }

    // Handle favorites filter toggle - only show if user is authenticated
    const handleFavoritesToggle = () => {
        updateFilters({ showFavoritesOnly: !filterState.showFavoritesOnly })
    }

    const handleHistoryToggle = () => {
        updateFilters({ showHistoryOnly: !filterState.showHistoryOnly })
    }

    const handleLocalStationsToggle = () => {
        const isCurrentlyLocal = filterState.countrycode !== 'all'
        updateFilters({ 
            countrycode: isCurrentlyLocal ? 'all' : (auth?.user?.country_code || 'all'),
            country: 'all'
        })
    }

    // Update local search state as user types
    const handleSearchChange = (e) => {
        setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))
    }
    return (
        <div className="bg-base-200 border-b border-base-300 h-14 flex-shrink-0">
            <div className="max-w-8xl mx-auto px-8 h-full">
                <div className="flex items-center justify-center gap-4 h-full">
                    {/* Local Stations Toggle - only show if user is authenticated and has country */}
                    {auth?.user?.country_name && (
                        <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                                <span className="label-text text-sm"><FontAwesomeIcon icon={faGlobe} /> Local</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-accent toggle-sm"
                                    checked={filterState.countrycode !== 'all'}
                                    onChange={handleLocalStationsToggle}
                                    title="Show stations from your country"
                                />
                            </label>
                        </div>
                    )}

                    {/* Favorites Toggle - only show if user is authenticated */}
                    {auth?.user && (
                        <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                                <span className="label-text text-sm"><FontAwesomeIcon icon={faHeart} /> Favorites</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary toggle-sm"
                                    checked={filterState.showFavoritesOnly}
                                    onChange={handleFavoritesToggle}
                                    title="Show favorites only"
                                />
                            </label>
                        </div>
                    )}

                    {/* History Toggle - only show if user is authenticated */}
                    {auth?.user && (
                        <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                                <span className="label-text text-sm"><FontAwesomeIcon icon={faMusic} /> History</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-secondary toggle-sm"
                                    checked={filterState.showHistoryOnly}
                                    onChange={handleHistoryToggle}
                                    title="Show your listening history"
                                />
                            </label>
                        </div>
                    )}

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="form-control">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                <FontAwesomeIcon icon={faSearch} className="text-base-content opacity-70" />
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

                    {/* Country Filter - hide when local stations filter is active */}
                    {filterState.countrycode === 'all' && (
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
                    )}

                    {/* Sort Options */}
                    <div className="form-control">
                        <select 
                            className="select select-bordered select-sm w-40"
                            value={`${filterState.sortBy}-${filterState.sortDirection}`}
                            onChange={handleSortChange}
                        >
                            <option value="votes-desc">Most Voted</option>
                            <option value="votes-asc">Least Voted</option>
                            <option value="clickcount-desc">Most Popular</option>
                            <option value="clickcount-asc">Least Popular</option>
                            <option value="clicktrend-desc">Trending Up</option>
                            <option value="clicktrend-asc">Trending Down</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}