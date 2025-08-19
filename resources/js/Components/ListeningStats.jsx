import React, { useState, useEffect } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faSync, faTrophy, faChartBar, faGlobe, faHeadphones } from '@fortawesome/free-solid-svg-icons'

export default function ListeningStats() {
    const { auth } = usePage().props
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!auth?.user) {
            setLoading(false)
            return
        }

        fetchStats()
    }, [auth?.user])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/listening/stats', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch stats')
            }

            const data = await response.json()
            setStats(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!auth?.user) {
        return (
            <div className="card bg-base-200">
                <div className="card-body text-center">
                    <h3 className="card-title"><FontAwesomeIcon icon={faMusic} /> Listening Stats</h3>
                    <p className="text-base-content/60">
                        Sign in to track your listening time!
                    </p>
                    <Link href="/login" className="btn btn-primary btn-sm">
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="card bg-base-200">
                <div className="card-body">
                    <h3 className="card-title"><FontAwesomeIcon icon={faMusic} /> Listening Stats</h3>
                    <div className="flex justify-center py-4">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card bg-base-200">
                <div className="card-body">
                    <h3 className="card-title"><FontAwesomeIcon icon={faMusic} /> Listening Stats</h3>
                    <div className="alert alert-error">
                        <span>Failed to load stats: {error}</span>
                    </div>
                    <button onClick={fetchStats} className="btn btn-sm">
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                    <FontAwesomeIcon icon={faMusic} /> Listening Stats
                    <button 
                        onClick={fetchStats} 
                        className="btn btn-ghost btn-xs"
                        title="Refresh stats"
                    >
                        <FontAwesomeIcon icon={faSync} />
                    </button>
                </h3>

                {/* Total listening time */}
                <div className="stat bg-base-100 rounded-box mb-4">
                    <div className="stat-title">Total Listening Time</div>
                    <div className="stat-value text-primary text-2xl">
                        {stats?.total_formatted || '0s'}
                    </div>
                    <div className="stat-desc">
                        Across all stations
                    </div>
                </div>

                {/* Top stations */}
                {stats?.station_stats && stats.station_stats.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faTrophy} /> Top Stations
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {stats.station_stats.slice(0, 10).map((station, index) => (
                                <div key={station.station_uuid} className="flex items-center justify-between p-3 bg-base-100 rounded-box">
                                    <div className="flex items-center gap-3">
                                        <div className="badge badge-primary badge-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">
                                                {station.station_name || `Station ${station.station_uuid.slice(0, 8)}...`}
                                            </div>
                                            <div className="text-xs text-base-content/60">
                                                {station.country && (
                                                    <span className="mr-2"><FontAwesomeIcon icon={faGlobe} /> {station.country}</span>
                                                )}
                                                {station.session_count} session{station.session_count !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-sm">
                                            {station.formatted_duration}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent sessions */}
                {stats?.recent_sessions && stats.recent_sessions.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faChartBar} /> Recent Sessions
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {stats.recent_sessions.slice(0, 5).map((session, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-base-100 rounded text-sm">
                                    <div>
                                        <div className="font-medium">
                                            {session.station_name || `Station ${session.station_uuid.slice(0, 8)}...`}
                                        </div>
                                        <div className="text-xs text-base-content/60">
                                            {session.country && (
                                                <span className="mr-2"><FontAwesomeIcon icon={faGlobe} /> {session.country}</span>
                                            )}
                                            {new Date(session.started_at).toLocaleDateString()} {new Date(session.started_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-semibold ${session.is_active ? 'text-success' : ''}`}>
                                            {session.formatted_duration}
                                        </div>
                                        {session.is_active && (
                                            <div className="text-xs text-success">
                                                ● Live
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {(!stats?.station_stats || stats.station_stats.length === 0) && (
                    <div className="text-center py-8 text-base-content/60">
                        <div className="text-4xl mb-2"><FontAwesomeIcon icon={faHeadphones} size="3x" /></div>
                        <p>Start listening to see your stats!</p>
                    </div>
                )}
            </div>
        </div>
    )
}