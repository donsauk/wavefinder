import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { useAudio } from '../Contexts/AudioContext'

function StationIcon({ station }) {
    const [imageError, setImageError] = useState(false)
    const fallback = station.name?.charAt(0).toUpperCase() || '?'
    return (
        <div className="avatar">
            <div className="w-12 rounded-full bg-primary text-primary-content overflow-hidden">
                {station.favicon && !imageError ? (
                    <img src={station.favicon} alt="" onError={() => setImageError(true)} />
                ) : (
                    <span className="text-lg font-semibold flex items-center justify-center h-full">{fallback}</span>
                )}
            </div>
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
    
    const [previousVolume, setPreviousVolume] = useState(1)

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

    const handleMuteToggle = () => {
        if (volume > 0) {
            setPreviousVolume(volume)
            changeVolume(0)
        } else {
            changeVolume(previousVolume)
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-base-200 border-t border-primary/20 px-4 py-3 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Station Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Station Icon */}
                    <StationIcon station={currentStation} />
                    
                    {/* Station Details */}
                    <div className="min-w-0 flex-1">
                        <Link 
                            href={`/station/${currentStation.stationuuid}`}
                            className="font-semibold text-lg hover:underline block truncate"
                        >
                            {currentStation.name || 'Unknown Station'}
                        </Link>
                        {currentStation.country && (
                            <div className="text-xs opacity-70 truncate">
                                {currentStation.country}
                            </div>
                        )}
                    </div>
                </div>

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

                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                    <button 
                        onClick={handleMuteToggle}
                        className="opacity-70 hover:opacity-100 flex-shrink-0"
                    >
                        <FontAwesomeIcon 
                            icon={volume > 0 ? faVolumeHigh : faVolumeMute} 
                            className="w-4 h-4"
                        />
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                        className="range range-primary range-xs w-32"
                    />
                    <span className="text-xs opacity-70 min-w-[2.5ch] text-right">{Math.round(volume * 100)}%</span>
                </div>
            </div>
        </div>
    )
}
