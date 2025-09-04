import React from 'react'
import { router } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faHandPointer, faFire, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { useAudio } from '../Contexts/AudioContext'

export default function StationCard({ station }) {
    const { currentStation, playStation, pauseStation, isPlaying, isLoading } = useAudio()
    
    // Check if this station is currently playing
    const isCurrentStation = currentStation?.stationuuid === station.stationuuid
    const isStationLoading = isCurrentStation && isLoading
    // When any station is loading, dim and disable interaction for others
    const isOtherStationDisabled = Boolean(isLoading && currentStation && !isCurrentStation)

    // Handle station card click - tracks click and navigates to station page using Inertia
    const handleStationCardClick = (stationuuid) => {
        // Track click via Inertia POST and then navigate - Inertia handles CSRF automatically
        router.post(`/station/${stationuuid}/click`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Navigate to station page after successful click tracking
                router.get(`/station/${stationuuid}`)
            },
            onError: () => {
                // Navigate anyway even if click tracking fails - don't block user
                router.get(`/station/${stationuuid}`)
            }
        })
    };

    // Handle play button click on station icon - plays station directly without navigation
    const handlePlayButtonClick = (e, station) => {
        e.stopPropagation(); // Prevent card click navigation
        e.preventDefault(); // Prevent any default browser behavior
        
        try {
            // Check if this station is currently playing
            const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
            
            if (isCurrentStation && isPlaying) {
                // Pause if currently playing this station
                pauseStation();
            } else {
                // Play the station (either new station or resume current)
                playStation(station);
            }
        } catch (error) {
            console.error('Error handling play button click:', error);
        }
    };

    return (
        <div 
            key={station.stationuuid} 
            className={`card bg-base-200 relative border ${
                isStationLoading 
                    ? 'border-primary ring-4 ring-primary/40 animate-pulse shadow-lg shadow-primary/30 cursor-wait' 
                    : 'border-transparent hover:border-primary cursor-pointer'
            } ${
                isOtherStationDisabled 
                    ? 'pointer-events-none opacity-60 filter saturate-50 cursor-not-allowed' 
                    : ''
            }`}
            aria-disabled={isOtherStationDisabled}
            onClick={() => handleStationCardClick(station.stationuuid)}
        >
            {/* Green Speaker Icon for Currently Playing - Top Right Corner */}
            {isCurrentStation && isPlaying && (
                <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z"/>
                    </svg>
                </div>
            )}
            <div className="card-body p-2">
                {/* Station Icon - Larger with hover play overlay */}
                <div className="flex justify-center my-2">
                    <div 
                        className={`relative w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl overflow-hidden ${isOtherStationDisabled ? '' : 'cursor-pointer'} group transition hover:ring-4 hover:ring-secondary ${isCurrentStation && isPlaying ? 'ring-4 ring-accent' : ''}`}
                        onClick={(e) => handlePlayButtonClick(e, station)}
                    >
                        {station.favicon ? (
                            <img 
                                src={station.favicon} 
                                alt=""
                                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : null}
                        
                        {/* Fallback letter - only show when no favicon or favicon failed to load */}
                        <span className="transition-opacity duration-300 group-hover:opacity-70 absolute inset-0 flex items-center justify-center text-2xl">
                            {(!station.favicon) ? (station.name?.charAt(0).toUpperCase() || '?') : ''}
                        </span>
                        
                        {/* Hover Play Button Overlay - shows play/pause based on current state */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {isCurrentStation && isPlaying ? (
                                <FontAwesomeIcon icon={faPause} className="w-16 h-16 text-white drop-shadow-lg" />
                            ) : (
                                <FontAwesomeIcon icon={faPlay} className="w-16 h-16 text-white drop-shadow-lg" />
                            )}
                        </div>
                        
                        {/* Currently Playing Indicator */}
                        {isCurrentStation && isPlaying && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Station Name - Bigger text */}
                <div className="h-14 flex items-center justify-center px-2">
                    <h3 className="font-semibold text-base text-center line-clamp-2" title={station.name}>
                        {station.name || 'Unknown Station'}
                    </h3>
                </div>

                {/* Badges - Bigger */}
                <div className="h-6 flex justify-center items-center gap-1">
                    {station.countrycode && (
                        <span className="badge badge-outline badge-sm">
                            {station.countrycode}
                        </span>
                    )}
                </div>

                {/* Stats - Bigger */}
                <div className="h-5 flex justify-center items-center gap-3 text-sm opacity-60">
                    <span><FontAwesomeIcon icon={faThumbsUp} /> {station.votes}</span>
                    <span><FontAwesomeIcon icon={faHandPointer} /> {station.clickcount}</span>
                    <span><FontAwesomeIcon icon={faFire} /> {station.clicktrend}</span>
                </div>
            </div>
        </div>
    )
}
