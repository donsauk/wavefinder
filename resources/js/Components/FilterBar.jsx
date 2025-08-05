import React from 'react'

export default function FilterBar() {
    return (
        <div className="bg-base-200 border-b border-base-300 h-14 flex-shrink-0">
            <div className="max-w-8xl mx-auto px-8 h-full">
                <div className="flex items-center justify-center gap-4 h-full">
                    {/* Search Bar */}
                    <div className="form-control">
                        <input 
                            type="text" 
                            placeholder="Search stations..." 
                            className="input input-bordered input-sm w-64" 
                        />
                    </div>

                    {/* Country Filter */}
                    <div className="form-control">
                        <select className="select select-bordered select-sm w-32">
                            <option value="">All Countries</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IT">Italy</option>
                        </select>
                    </div>

                    {/* Language Filter */}
                    <div className="form-control">
                        <select className="select select-bordered select-sm w-28">
                            <option value="">Language</option>
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                        </select>
                    </div>

                    {/* Quality Filter */}
                    <div className="form-control">
                        <select className="select select-bordered select-sm w-24">
                            <option value="">Quality</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="form-control">
                        <select className="select select-bordered select-sm w-32">
                            <option value="votes">Most Voted</option>
                            <option value="clicks">Most Popular</option>
                            <option value="name">Name A-Z</option>
                            <option value="recent">Recently Added</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <button className="btn btn-ghost btn-sm">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    )
}