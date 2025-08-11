import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { Howl } from 'howler'

const AudioContext = createContext()

export function useAudio() {
    const context = useContext(AudioContext)
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider')
    }
    return context
}

export function AudioProvider({ children, auth = null }) {
    
    // Current station state
    const [currentStation, setCurrentStation] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [volume, setVolume] = useState(0.05) // Default volume
    
    // Howler instance reference
    const howlerRef = useRef(null)
    
    // Time tracking references
    const heartbeatIntervalRef = useRef(null)
    const currentSessionRef = useRef(null)

    // Start listening session tracking
    const startListeningSession = async (stationUuid) => {
        if (!auth?.user || !stationUuid) return

        try {
            const response = await fetch('/api/listening/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({ station_uuid: stationUuid })
            })

            if (response.ok) {
                const data = await response.json()
                currentSessionRef.current = data.session_id
                
                // Start heartbeat to keep session alive
                startHeartbeat(stationUuid)
            }
        } catch (error) {
            console.warn('Time tracking unavailable:', error.message)
            // Don't throw - let audio continue playing
        }
    }

    // Stop listening session tracking
    const stopListeningSession = async () => {
        if (!auth?.user) return

        // Stop heartbeat
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current)
            heartbeatIntervalRef.current = null
        }

        try {
            await fetch('/api/listening/stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            })
        } catch (error) {
            console.warn('Error stopping time tracking:', error.message)
            // Don't throw - this is cleanup
        }

        currentSessionRef.current = null
    }

    // Send heartbeat to keep session alive
    const startHeartbeat = (stationUuid) => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current)
        }

        heartbeatIntervalRef.current = setInterval(async () => {
            if (!auth?.user || !stationUuid) return

            try {
                await fetch('/api/listening/heartbeat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                    },
                    body: JSON.stringify({ station_uuid: stationUuid })
                })
            } catch (error) {
                console.warn('Heartbeat failed:', error.message)
                // Don't throw - just warn
            }
        }, 30000) // Send heartbeat every 30 seconds
    }

    // Play a station - can be called from anywhere in the app
    const playStation = (station) => {
        const streamUrl = station.url_resolved || station.url
        if (!streamUrl) {
            alert('No stream URL available for this station.')
            return
        }

        setIsLoading(true)
        console.log('Playing station:', station.name, 'URL:', streamUrl)
        
        // Stop any existing audio with proper cleanup
        if (howlerRef.current) {
            try {
                howlerRef.current.stop()
                howlerRef.current.unload()
                howlerRef.current = null
            } catch (error) {
                console.warn('Error cleaning up previous audio:', error)
                howlerRef.current = null
            }
        }

        // Set current station
        setCurrentStation(station)

        // Add small delay to ensure cleanup is complete
        setTimeout(() => {
            // Create new Howler instance
            howlerRef.current = new Howl({
                src: [streamUrl],
                html5: true,
                format: ['mp3', 'aac'],
                volume: volume,
                onload: () => {
                    setIsLoading(false)
                    setIsPlaying(true)
                    // Start time tracking when audio successfully loads (non-blocking)
                    setTimeout(() => {
                        startListeningSession(station.stationuuid)
                    }, 0)
                },
                onplay: () => {
                    setIsPlaying(true)
                },
                onpause: () => {
                    setIsPlaying(false)
                },
                onstop: () => {
                    setIsPlaying(false)
                    // Stop time tracking when audio stops (non-blocking)
                    setTimeout(() => {
                        stopListeningSession()
                    }, 0)
                },
                onloaderror: (id, error) => {
                    console.error('Audio load error:', error)
                    setIsLoading(false)
                    setIsPlaying(false)
                    alert('Failed to load audio stream. Please try again.')
                },
                onplayerror: (id, error) => {
                    console.error('Audio play error:', error)
                    setIsLoading(false)
                    setIsPlaying(false)
                    alert('Failed to play audio stream. Please try again.')
                }
            })

            // Start playing
            try {
                howlerRef.current.play()
            } catch (error) {
                console.error('Error starting playback:', error)
                setIsLoading(false)
                setIsPlaying(false)
                alert('Failed to start playback. Please try again.')
            }
        }, 50)
    }

    // Pause current audio (completely stops the stream)
    const pauseStation = () => {
        if (howlerRef.current) {
            try {
                howlerRef.current.stop()
                setIsPlaying(false)
                // Stop time tracking when paused (non-blocking)
                setTimeout(() => {
                    stopListeningSession()
                }, 0)
            } catch (error) {
                console.warn('Error pausing audio:', error)
                setIsPlaying(false)
                setTimeout(() => {
                    stopListeningSession()
                }, 0)
            }
        }
    }

    // Resume current audio (restarts the stream from beginning)
    const resumeStation = () => {
        if (currentStation) {
            playStation(currentStation)
        }
    }


    // Handle volume change
    const changeVolume = (newVolume) => {
        setVolume(newVolume)
        if (howlerRef.current) {
            howlerRef.current.volume(newVolume)
        }
    }

    // Cleanup on unmount only
    useEffect(() => {
        // Handle page unload/close
        const handleBeforeUnload = () => {
            stopListeningSession()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            
            // Clean up audio and time tracking only on unmount
            stopListeningSession()
            if (howlerRef.current) {
                try {
                    howlerRef.current.stop()
                    howlerRef.current.unload()
                    howlerRef.current = null
                } catch (error) {
                    console.warn('Error during audio cleanup:', error)
                    howlerRef.current = null
                }
            }
        }
    }, [])

    const value = {
        // State
        currentStation,
        isPlaying,
        isLoading,
        volume,
        
        // Actions
        playStation,
        pauseStation,
        resumeStation,
        changeVolume
    }

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    )
}