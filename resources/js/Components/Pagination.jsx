import React from 'react'
import { Link, router, useRemember } from '@inertiajs/react'

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
        <div className="flex-shrink-0 bg-base-100 h-16">
            <div className="max-w-8xl mx-auto px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Page Info - Left */}
                    <div className="text-sm text-base-content/70 min-w-[200px]">
                        Showing {data.from} to {data.to} of {data.total} {itemName}
                    </div>

                    {/* Pagination Controls - Center */}
                    <div className="flex items-center space-x-1">
                        {/* Previous button */}
                        {data.prev_page_url && (
                            <Link
                                href={data.prev_page_url}
                                className="btn btn-outline btn-sm"
                                preserveState
                                preserveScroll
                            >
                                ← Previous
                            </Link>
                        )}

                        {/* Page numbers */}
                        {data.links && data.links.length > 3 && (
                            <div className="join mx-2">
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
                                            className="join-item btn btn-sm btn-outline hover:btn-secondary"
                                            title="Click to go to a random page! 🎲"
                                        >
                                            {link.label}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`join-item btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline'}`}
                                        preserveState
                                        preserveScroll
                                    >
                                        {link.label}
                                    </Link>
                                );
                                })}
                            </div>
                        )}

                        {/* Next button */}
                        {data.next_page_url && (
                            <Link
                                href={data.next_page_url}
                                className="btn btn-outline btn-sm"
                                preserveState
                                preserveScroll
                            >
                                Next →
                            </Link>
                        )}

                        {/* Jump to page */}
                        <form onSubmit={handlePageJump} className="flex items-center space-x-1 ml-3">
                            <input
                                type="number"
                                min="1"
                                max={data.last_page}
                                value={paginationState.customPage}
                                onChange={(e) => setPaginationState({ customPage: e.target.value })}
                                placeholder="Page"
                                className="input input-sm w-16 input-bordered"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                disabled={!paginationState.customPage || parseInt(paginationState.customPage) < 1 || parseInt(paginationState.customPage) > data.last_page}
                            >
                                Go
                            </button>
                        </form>
                    </div>

                    {/* Balance right side */}
                    <div className="min-w-[200px]"></div>
                </div>
            </div>
        </div>
    );
}