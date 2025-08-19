import React, { useState, useEffect } from 'react'
import { router, usePage, useForm } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { useAudio } from '../Contexts/AudioContext'

// Safe Station Icon Component - handles image loading errors without DOM manipulation
function StationIcon({ station, className = "w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl overflow-hidden mb-4" }) {
    const [imageError, setImageError] = useState(false)
    
    return (
        <div className={className}>
            {station.favicon && !imageError ? (
                <img 
                    src={station.favicon} 
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span>{station.name?.charAt(0).toUpperCase() || '?'}</span>
            )}
        </div>
    )
}

export default function StationHeader({ station, isFavorited, canVote, nextVoteTime }) {
    const { auth } = usePage().props
    const [voteStatus, setVoteStatus] = useState({ canVote })
    const [countdown, setCountdown] = useState('')
    
    // Use global audio context instead of local state
    const { 
        currentStation, 
        isPlaying, 
        isLoading, 
        volume, 
        playStation, 
        pauseStation, 
        changeVolume 
    } = useAudio()
    
    // Check if this station is currently playing
    const isCurrentStation = currentStation?.stationuuid === station.stationuuid
    
    // Handle favorite toggle with simple form submission
    const handleFavoriteToggle = () => {
        router.post('/favorites/toggle', {
            station_uuid: station.stationuuid
        }, {
            preserveScroll: true, // Don't scroll to top after toggle
        })
    }

    // Use Inertia form for voting - handles CSRF and errors automatically
    const { post: submitVote, processing: isVoting } = useForm()

    // Handle voting for station using Inertia form submission
    const handleVoteStation = () => {
        if (!auth?.user || isVoting || !voteStatus.canVote) {
            return;
        }

        // Submit vote using Inertia - handles CSRF, loading state, and errors automatically
        submitVote(`/station/${station.stationuuid}/vote`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Update local vote status - page will refresh with new data
                setVoteStatus({ canVote: false });
            },
            onError: (errors) => {
                // Inertia will handle error display via flash messages or error props
                console.error('Vote submission failed:', errors);
            }
        });
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

    // Handle station play/pause using global audio context
    const handlePlayStation = () => {
        if (isCurrentStation && isPlaying) {
            // Pause current station
            pauseStation()
        } else if (isCurrentStation && !isPlaying) {
            // Resume current station (handled by AudioPlayer component)
            // For consistency, we'll treat this as playing the station again
            playStation(station)
        } else {
            // Play new station
            playStation(station)
        }
    }

    return (
        <div className="flex flex-col items-center text-center">
            {/* Station Icon */}
            <StationIcon station={station} />
            
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
                    className={`btn btn-lg ${isCurrentStation && isPlaying ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handlePlayStation}
                    disabled={isLoading}
                >
                    {isLoading && isCurrentStation ? (
                        <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Loading...
                        </>
                    ) : isCurrentStation && isPlaying ? (
                        <>
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v10a1.5 1.5 0 0 1-3 0V5A1.5 1.5 0 0 1 5.5 3.5zm6 0A1.5 1.5 0 0 1 13 5v10a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                            Pause
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l7-5-7-5z"/>
                            </svg>
                            {isCurrentStation ? 'Resume' : 'Play Station'}
                        </>
                    )}
                </button>
                
                {/* Favorite Button - only show if user is authenticated */}
                {auth?.user && (
                    <button 
                        onClick={handleFavoriteToggle}
                        className={`btn btn-lg ${isFavorited ? 'btn-secondary' : 'btn-outline btn-secondary'}`}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <FontAwesomeIcon icon={isFavorited ? faHeart : faHeartBroken} />
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
                                <FontAwesomeIcon icon={faThumbsUp} /> Vote
                                {countdown && <span className="ml-1 text-xs">({countdown})</span>}
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Volume Control */}
            <div className="mt-6">
                <div className="flex items-center gap-3 justify-center">
                    <svg className="w-5 h-5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                        className="range range-primary range-sm w-64"
                    />
                    <span className="text-sm opacity-70 min-w-[3ch]">{Math.round(volume * 100)}%</span>
                </div>
            </div>
        </div>
    )
}