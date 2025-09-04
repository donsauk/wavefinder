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
    
    const [currentStation, setCurrentStation] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [volume, setVolume] = useState(0.05)
    
    const howlerRef = useRef(null)
    
    // Time tracking references
    const heartbeatIntervalRef = useRef(null)
    const currentSessionRef = useRef(null)

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
                startHeartbeat(stationUuid)
            }
        } catch (error) {
            console.warn('Time tracking unavailable:', error?.message)
        }
    }

    const stopListeningSession = async () => {
        if (!auth?.user) return

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
            console.warn('Error stopping time tracking:', error?.message)
        }

        currentSessionRef.current = null
    }

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
                console.warn('Heartbeat failed:', error?.message)
            }
        }, 30000) // Send heartbeat every 30 seconds
    }

    const playStation = (station) => {
        const streamUrl = station.url_resolved || station.url
        if (!streamUrl) {
            console.warn('No stream URL available for this station.')
            return
        }

        setIsLoading(true)
        
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

        setCurrentStation(station)
        howlerRef.current = new Howl({
            src: [streamUrl],
            html5: true,
            format: ['mp3', 'aac'],
            volume,
            onload: () => {
                setIsLoading(false)
                setIsPlaying(true)
                startListeningSession(station.stationuuid)
            },
            onplay: () => setIsPlaying(true),
            onpause: () => setIsPlaying(false),
            onstop: () => {
                setIsPlaying(false)
                stopListeningSession()
            },
            onloaderror: (_id, error) => {
                console.warn('Audio load error:', error)
                setIsLoading(false)
                setIsPlaying(false)
            },
            onplayerror: (_id, error) => {
                console.warn('Audio play error:', error)
                setIsLoading(false)
                setIsPlaying(false)
            }
        })

        try {
            howlerRef.current.play()
        } catch (error) {
            console.warn('Error starting playback:', error)
            setIsLoading(false)
            setIsPlaying(false)
        }
    }

    const pauseStation = () => {
        if (howlerRef.current) {
            try {
                howlerRef.current.stop()
                setIsPlaying(false)
                stopListeningSession()
            } catch (error) {
                console.warn('Error pausing audio:', error)
                setIsPlaying(false)
                stopListeningSession()
            }
        }
    }

    const resumeStation = () => {
        if (currentStation) {
            playStation(currentStation)
        }
    }


    const changeVolume = (newVolume) => {
        setVolume(newVolume)
        if (howlerRef.current) {
            howlerRef.current.volume(newVolume)
        }
    }

    // Cleanup on unmount only
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopListeningSession()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            
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
