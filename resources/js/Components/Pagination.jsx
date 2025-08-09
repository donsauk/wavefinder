import React, { useState } from 'react'
import { Link, router } from '@inertiajs/react'

export default function Pagination({ data, itemName = 'items' }) {
    const [customPage, setCustomPage] = useState('');

    if (!data || !data.links) {
        return null;
    }

    const handlePageJump = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(customPage);
        if (pageNumber && pageNumber >= 1 && pageNumber <= data.last_page) {
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('page', pageNumber);
            router.get(currentUrl.toString(), {}, {
                preserveState: true,
                preserveScroll: true
            });
            setCustomPage('');
        }
    };

    // Navigate to a random page when ellipsis dots are clicked
    const handleRandomPage = (e) => {
        e.preventDefault();
        const randomPage = Math.floor(Math.random() * data.last_page) + 1;
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('page', randomPage);
        router.get(currentUrl.toString(), {}, {
            preserveState: true,
            preserveScroll: true
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
                                value={customPage}
                                onChange={(e) => setCustomPage(e.target.value)}
                                placeholder="Page"
                                className="input input-sm w-16 input-bordered"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                disabled={!customPage}
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