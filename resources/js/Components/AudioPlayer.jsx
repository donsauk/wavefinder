import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useAudio } from '../Contexts/AudioContext'

// Safe Station Icon Component - handles image loading errors without DOM manipulation
function StationIcon({ station, className = "w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white text-lg overflow-hidden flex-shrink-0" }) {
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

export default function AudioPlayer() {
    const { 
        currentStation, 
        isPlaying, 
        isLoading, 
        volume, 
        pauseStation, 
        resumeStation, 
        changeVolume 
    } = useAudio()

    // Don't show the player if no station is loaded
    if (!currentStation) {
        return null
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseStation()
        } else {
            resumeStation()
        }
    }

    return (
        // Fixed bottom audio player bar (Spotify-style) - positioned at true bottom
        <div className="fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 px-4 py-3 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Station Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Station Icon */}
                    <StationIcon station={currentStation} />
                    
                    {/* Station Details */}
                    <div className="min-w-0 flex-1">
                        <Link 
                            href={`/station/${currentStation.stationuuid}`}
                            className="font-semibold text-sm hover:underline block truncate"
                        >
                            {currentStation.name || 'Unknown Station'}
                        </Link>
                        <div className="text-xs opacity-70 truncate">
                            {currentStation.country && (
                                <span>{currentStation.country}</span>
                            )}
                            {currentStation.codec && (
                                <span className="ml-2">{currentStation.codec}</span>
                            )}
                            {currentStation.bitrate && (
                                <span className="ml-2">{currentStation.bitrate} kbps</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-4 px-8">
                    <button 
                        className="btn btn-circle btn-primary"
                        onClick={handlePlayPause}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>
                    
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                    <svg className="w-4 h-4 opacity-70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                        className="range range-primary range-xs w-20"
                    />
                    <span className="text-xs opacity-70 min-w-[2.5ch] text-right">{Math.round(volume * 100)}%</span>
                </div>
            </div>
        </div>
    )
}