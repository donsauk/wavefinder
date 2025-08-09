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

export function AudioProvider({ children }) {
    // Current station state
    const [currentStation, setCurrentStation] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [volume, setVolume] = useState(0.05) // Default volume
    
    // Howler instance reference
    const howlerRef = useRef(null)

    // Play a station - can be called from anywhere in the app
    const playStation = (station) => {
        const streamUrl = station.url_resolved || station.url
        if (!streamUrl) {
            alert('No stream URL available for this station.')
            return
        }

        setIsLoading(true)
        console.log('Playing station:', station.name, 'URL:', streamUrl)
        
        // Stop any existing audio
        if (howlerRef.current) {
            howlerRef.current.stop()
            howlerRef.current.unload()
        }

        // Set current station
        setCurrentStation(station)

        // Create new Howler instance
        howlerRef.current = new Howl({
            src: [streamUrl],
            html5: true,
            format: ['mp3', 'aac'],
            volume: volume,
            onload: () => {
                setIsLoading(false)
                setIsPlaying(true)
            },
            onplay: () => {
                setIsPlaying(true)
            },
            onpause: () => {
                setIsPlaying(false)
            },
            onstop: () => {
                setIsPlaying(false)
            },
            onloaderror: (id, error) => {
                console.error('Audio load error:', error)
                setIsLoading(false)
                alert('Failed to load audio stream. Please try again.')
            },
            onplayerror: (id, error) => {
                console.error('Audio play error:', error)
                setIsLoading(false)
                alert('Failed to play audio stream. Please try again.')
            }
        })

        // Start playing
        howlerRef.current.play()
    }

    // Pause current audio
    const pauseStation = () => {
        if (howlerRef.current && isPlaying) {
            howlerRef.current.pause()
        }
    }

    // Resume current audio
    const resumeStation = () => {
        if (howlerRef.current && !isPlaying) {
            howlerRef.current.play()
        }
    }

    // Stop current audio
    const stopStation = () => {
        if (howlerRef.current) {
            howlerRef.current.stop()
            setIsPlaying(false)
        }
    }

    // Handle volume change
    const changeVolume = (newVolume) => {
        setVolume(newVolume)
        if (howlerRef.current) {
            howlerRef.current.volume(newVolume)
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (howlerRef.current) {
                howlerRef.current.stop()
                howlerRef.current.unload()
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
        stopStation,
        changeVolume
    }

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    )
}