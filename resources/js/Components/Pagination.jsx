import React from 'react'
import { Link, router, useRemember } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Pagination({ data, itemName = 'items' }) {
    
    // Remember pagination jump state for better UX
    const [paginationState, setPaginationState] = useRemember({
        customPage: ''
    }, 'PaginationState');

    if (!data || !data.links) {
        return null;
    }

    // Enhanced page jump with better validation and UX
    const handlePageJump = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(paginationState.customPage);
        if (pageNumber && pageNumber >= 1 && pageNumber <= data.last_page) {
            // Use current URL params and only update page
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('page', pageNumber);
            
            // Use global route() function for consistent routing
            router.get(route('browse'), Object.fromEntries(currentParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true // Replace URL for pagination
            });
            setPaginationState({ customPage: '' });
        }
    };

    // Navigate to a random page when ellipsis dots are clicked (Easter egg)
    const handleRandomPage = (e) => {
        e.preventDefault();
        const randomPage = Math.floor(Math.random() * data.last_page) + 1;
        
        // Preserve current search/filter params while changing page
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', randomPage);
        
        router.get(route('browse'), Object.fromEntries(currentParams), {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return (
        <div className="sticky bottom-0 z-10 bg-base-100/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center py-4">
                    
                    {/* Results Info - Left */}
                    <div className="flex justify-start">
                        <div className="text-sm text-base-content/70">
                            <span className="hidden sm:inline">Showing </span>
                            <span className="font-medium text-base-content">{data.from?.toLocaleString()}</span>
                            {' '}-{' '}
                            <span className="font-medium text-base-content">{data.to?.toLocaleString()}</span>
                            <span className="hidden sm:inline"> of </span>
                            <span className="sm:hidden"> / </span>
                            <span className="font-medium text-base-content">{data.total?.toLocaleString()}</span>
                            <span className="hidden sm:inline"> {itemName}</span>
                        </div>
                    </div>

                    {/* Main Pagination Controls - Center */}
                    <div className="relative flex items-center justify-center justify-self-center">
                        
                        {/* Previous Button - Positioned to the left */}
                        <div className="absolute right-full mr-2">
                            {data.prev_page_url ? (
                                <Link
                                    href={data.prev_page_url}
                                    className="btn btn-outline btn-sm gap-1 hover:btn-primary"
                                    preserveState
                                    preserveScroll
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Link>
                            ) : (
                                <button className="btn btn-outline btn-sm btn-disabled gap-1 opacity-50" disabled>
                                    <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>
                            )}
                        </div>

                        {/* Page Numbers - Perfectly Centered */}
                        {data.links && data.links.length > 3 && (
                            <div className="join">
                                {data.links.map((link, index) => {
                                    // Skip the "Previous" and "Next" text links
                                    if (index === 0 || index === data.links.length - 1) {
                                        return null;
                                    }

                                    // Check if this is an ellipsis (...) link
                                    if (link.label === '...' || link.label.includes('…')) {
                                        return (
                                            <button
                                                key={index}
                                                onClick={handleRandomPage}
                                                className="join-item btn btn-sm btn-outline hover:btn-primary tooltip"
                                                data-tip="Random page"
                                            >
                                                <FontAwesomeIcon icon={faDice} className="w-3 h-3" />
                                            </button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`join-item btn btn-sm ${
                                                link.active 
                                                    ? 'btn-primary' 
                                                    : 'btn-outline hover:btn-primary'
                                            }`}
                                            preserveState
                                            preserveScroll
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* Next Button - Positioned to the right */}
                        <div className="absolute left-full ml-2">
                            {data.next_page_url ? (
                                <Link
                                    href={data.next_page_url}
                                    className="btn btn-outline btn-sm gap-1 hover:btn-primary"
                                    preserveState
                                    preserveScroll
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
                                </Link>
                            ) : (
                                <button className="btn btn-outline btn-sm btn-disabled gap-1 opacity-50" disabled>
                                    <span className="hidden sm:inline">Next</span>
                                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Jump to Page - Right */}
                    <div className="flex justify-end">
                        <form onSubmit={handlePageJump} className="join">
                            <input
                                type="number"
                                min="1"
                                max={data.last_page}
                                value={paginationState.customPage}
                                onChange={(e) => setPaginationState({ customPage: e.target.value })}
                                placeholder="Page"
                                className="join-item input input-sm input-bordered w-20 text-center"
                            />
                            <button
                                type="submit"
                                className="join-item btn btn-primary btn-sm"
                                disabled={!paginationState.customPage || parseInt(paginationState.customPage) < 1 || parseInt(paginationState.customPage) > data.last_page}
                            >
                                Go
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}