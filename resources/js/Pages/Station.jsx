import React, { useState, useEffect } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

export default function Station({ station, isFavorited, canVote, nextVoteTime }) {
    const { auth } = usePage().props
    const [isVoting, setIsVoting] = useState(false)
    const [voteStatus, setVoteStatus] = useState({ canVote })
    const [countdown, setCountdown] = useState('')
    
    // Handle favorite toggle with simple form submission
    const handleFavoriteToggle = () => {
        router.post('/favorites/toggle', {
            station_uuid: station.stationuuid
        }, {
            preserveScroll: true, // Don't scroll to top after toggle
        })
    }

    // Handle voting for station
    const handleVoteStation = async () => {
        if (!auth?.user || isVoting || !voteStatus.canVote) {
            return;
        }

        setIsVoting(true);

        try {
            const response = await fetch(`/station/${station.stationuuid}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setVoteStatus({ canVote: false });
                
                if (data.api_down) {
                    alert('Thank you for voting! Your vote has been recorded locally.\n\n(Note: Radio Browser API is temporarily unavailable, but your vote still counts!)');
                } else {
                    alert('Thank you for voting! Your vote helps improve the Radio Browser database for everyone.');
                }
            } else {
                const data = await response.json();
                if (response.status === 429) {
                    // Rate limited
                    setVoteStatus({ canVote: false });
                    alert(`Rate limit exceeded. Please wait ${data.minutes_left} more minutes before voting again.`);
                } else {
                    alert(data.error || 'Failed to vote. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error voting for station:', error);
            alert('Error voting for station. Please check your connection.');
        } finally {
            setIsVoting(false);
        }
    };

    // Update countdown timer for when user can vote again
    useEffect(() => {
        if (!nextVoteTime || voteStatus.canVote) {
            setCountdown('');
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const nextVote = new Date(nextVoteTime);
            const diff = nextVote - now;

            if (diff <= 0) {
                setCountdown('');
                setVoteStatus({ ...voteStatus, canVote: true });
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextVoteTime, voteStatus.canVote]);

    // Handle station play - tracks click and gets stream URL
    const handlePlayStation = async () => {
        try {
            const response = await fetch(`/station/${station.stationuuid}/click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Playing station:', data.name, 'URL:', data.url);
                alert(`Playing: ${data.name}\nURL: ${data.url}\n\n(Audio player implementation coming soon!)`);
            } else {
                console.error('Failed to get station URL, status:', response.status);
                alert('Failed to play station. Please try again.');
            }
        } catch (error) {
            console.error('Error playing station:', error);
            alert('Error playing station. Please check your connection.');
        }
    }
    return (
        <>
            <Head title={`${station.name} - WAVEFINDER`} />
            <div className="min-h-screen bg-base-100 flex flex-col">
                {/* Navbar - Fixed height */}
                <Navbar />

                {/* Main content area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-6">
                        {/* Back button */}
                        <div className="mb-6">
                            <Link href="/browse" className="btn btn-outline btn-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Browse
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Station Header */}
                            <div className="flex flex-col items-center text-center">
                                {/* Station Icon */}
                                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl overflow-hidden mb-4">
                                    {station.favicon ? (
                                        <img 
                                            src={station.favicon} 
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = station.name?.charAt(0).toUpperCase() || '?';
                                            }}
                                        />
                                    ) : (
                                        station.name?.charAt(0).toUpperCase() || '?'
                                    )}
                                </div>
                                
                                {/* Station Name */}
                                <h1 className="text-3xl font-bold mb-2">{station.name || 'Unknown Station'}</h1>
                                
                                {/* Location Badge */}
                                {(station.country || station.countrycode) && (
                                    <div className="badge badge-secondary badge-lg mb-4">
                                        {station.country || station.countrycode}
                                        {station.state && `, ${station.state}`}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4 flex-wrap justify-center">
                                    <button 
                                        className="btn btn-primary btn-lg"
                                        onClick={handlePlayStation}
                                    >
                                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l7-5-7-5z"/>
                                        </svg>
                                        Play Station
                                    </button>
                                    
                                    {/* Favorite Button - only show if user is authenticated */}
                                    {auth?.user && (
                                        <button 
                                            onClick={handleFavoriteToggle}
                                            className={`btn btn-lg ${isFavorited ? 'btn-secondary' : 'btn-outline btn-secondary'}`}
                                            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            {isFavorited ? '❤️' : '🤍'}
                                        </button>
                                    )}
                                    
                                    {/* Vote Button - only show if user is authenticated */}
                                    {auth?.user && (
                                        <button
                                            onClick={handleVoteStation}
                                            disabled={isVoting || !voteStatus.canVote}
                                            className={`btn btn-lg ${voteStatus.canVote ? 'btn-accent' : 'btn-disabled'}`}
                                            title={
                                                voteStatus.canVote 
                                                    ? 'Vote for this station to help Radio Browser' 
                                                    : `Please wait ${countdown} before voting again`
                                            }
                                        >
                                            {isVoting ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                                    Voting...
                                                </>
                                            ) : (
                                                <>
                                                    👍 Vote
                                                    {countdown && <span className="ml-1 text-xs">({countdown})</span>}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Station Details */}
                            <div className="space-y-6">
                                {/* Statistics */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg mb-4">Statistics</h2>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-primary flex items-center justify-center">
                                                    <span className="mr-2">👍</span>
                                                    <span className="min-w-[80px] text-right">{station.votes}</span>
                                                </div>
                                                <div className="text-sm opacity-70">Votes</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-secondary flex items-center justify-center">
                                                    <span className="mr-2">👆</span>
                                                    <span className="min-w-[80px] text-right">{station.clickcount}</span>
                                                </div>
                                                <div className="text-sm opacity-70">Clicks</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-accent flex items-center justify-center">
                                                    <span className="mr-2">🔥</span>
                                                    <span className="min-w-[80px] text-right">{station.clicktrend}</span>
                                                </div>
                                                <div className="text-sm opacity-70">Trend</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Information */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg mb-4">Technical Details</h2>
                                        <div className="space-y-3">
                                            {station.codec && (
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Codec:</span>
                                                    <span className="font-semibold">{station.codec}</span>
                                                </div>
                                            )}
                                            {station.bitrate && (
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Bitrate:</span>
                                                    <span className="font-semibold">{station.bitrate} kbps</span>
                                                </div>
                                            )}
                                            {station.language && (
                                                <div className="flex justify-between">
                                                    <span className="opacity-70">Language:</span>
                                                    <span className="font-semibold">{station.language}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="opacity-70">HLS:</span>
                                                <span className={`badge ${station.hls ? 'badge-success' : 'badge-outline'}`}>
                                                    {station.hls ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="opacity-70">SSL:</span>
                                                <span className={`badge ${station.ssl_error ? 'badge-error' : 'badge-success'}`}>
                                                    {station.ssl_error ? 'Error' : 'OK'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                {station.tags && (
                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h2 className="card-title text-lg mb-4">Tags</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {station.tags.split(',').map((tag, index) => (
                                                    <span key={index} className="badge badge-outline">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {station.homepage && (
                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h2 className="card-title text-lg mb-4">Links</h2>
                                            <a 
                                                href={station.homepage} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-outline btn-sm"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Visit Homepage
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed height */}
                <Footer />
            </div>
        </>
    )
}